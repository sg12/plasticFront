/**
 * @fileoverview Форма записи на приём
 *
 * Многошаговая форма для создания записи на приём
 *
 * @module features/appointments/ui/AppointmentForm
 */

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"
import { Textarea } from "@/shared/ui/textarea"
import { formatDate } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/shared/lib/utils"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { useMe } from "@/entities/user/api/user.queries"
import { CreateAppointmentSchema, type CreateAppointmentDto } from "@/entities/appointment/model/appointment.schema"
import { useCreateAppointment } from "@/entities/appointment/api/appointment.queries"
import { AppointmentCalendarWithTime } from "@/features/user-management/appointments/ui/CalendarWithTime"
import { toast } from "sonner"
import { formatInTimeZone } from "date-fns-tz"
import { useTimeSlots } from "@/entities/schedule/api/shedule.queries"

interface AppointmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetId: string
}

export const AppointmentModal = ({
  open,
  onOpenChange,
  targetId
}: AppointmentFormProps) => {
  const { data: user } = useMe()
  const { mutateAsync: createAppointment, isPending } = useCreateAppointment()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { data: slots = [], isLoading } = useTimeSlots(targetId, formatDate(selectedDate!, "yyyy-MM-dd"), open)

  const isMobile = useIsMobile()

  const form = useForm<CreateAppointmentDto>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      reason: "",
      doctorId: targetId,
      timeSlotId: ""
    }
  })

  const selectedSlotObject = slots?.find(s => s.id === form.getValues("timeSlotId"));

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentStep(0)
      form.reset()
    }
  }, [open, form])

  const steps = [
    { id: "dateTime", label: "Дата и время", description: "Выберите свободный слот" },
    { id: "info", label: "Информация", description: "Дополнительные детали" },
    { id: "confirm", label: "Подтверждение", description: "Проверьте данные" },
  ]

  const nextStep = async () => {
    const fieldsByStep: Record<number, (keyof CreateAppointmentDto)[]> = {
      0: ["timeSlotId"],
      1: ["reason"],
    }

    const isValid = await form.trigger(fieldsByStep[currentStep])
    if (isValid) setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => setCurrentStep((prev) => prev - 1)

  const handleTimeSlotSelect = (timeSlotId: string) => {
    form.setValue("timeSlotId", timeSlotId)
    form.clearErrors("timeSlotId")
  }

  const onSubmit = async (data: CreateAppointmentDto) => {
    await createAppointment({
      ...data,
      doctorId: targetId,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(isMobile && "flex flex-col p-0")}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              toast.error(Object.values(errors)[0].message)
            })}
            className={cn("space-child", isMobile && "flex h-full flex-col p-6")}
          >
            <div className={cn(isMobile && "flex-1 overflow-y-auto")}>
              <DialogHeader className="mb-4">
                <div className="flex gap-1 mb-2">
                  {steps.map((_, i) => (
                    <div key={i} className={cn("h-1 flex-1 rounded-full", i <= currentStep ? "bg-primary" : "bg-muted")} />
                  ))}
                </div>
                <DialogTitle>{steps[currentStep].label}</DialogTitle>
                <DialogDescription>{steps[currentStep].description}</DialogDescription>
              </DialogHeader>

              {/* <StepIndicator steps={steps} currentStep={currentStep} /> */}

              {currentStep === 0 && (
                <FormField
                  control={form.control}
                  name="timeSlotId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AppointmentCalendarWithTime
                          slots={slots}
                          isLoading={isLoading}
                          selectedDate={selectedDate!}
                          onSelectDate={setSelectedDate}
                          selectedTime={field.value}
                          onSelectTime={handleTimeSlotSelect}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentStep === 1 && (
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Причина обращения</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Например: плановый осмотр, жалобы на боли..."
                          className="min-h-[120px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Укажите причину обращения для лучшей подготовки к приёму
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentStep === 2 && (
                <div className="rounded-xl border bg-muted/30 p-5 space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Детали записи</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Дата:</span>
                      <span className="font-medium text-right">
                        {selectedSlotObject ? (
                          formatInTimeZone(new Date(selectedSlotObject.startAt), "UTC", "d MMMM yyyy", { locale: ru })
                        ) : (
                          <span className="text-destructive">Дата не выбрана</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Время:</span>
                      <span className="font-medium">
                        {selectedSlotObject ? (
                          formatInTimeZone(new Date(selectedSlotObject.startAt), "UTC", "HH:mm")
                        ) : (
                          <span className="text-destructive">Время не выбрано</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-muted-foreground">Пациент:</span>
                      <span className="font-medium">{user?.fullName || "Не указано"}</span>
                    </div>
                    {form.getValues("reason") && (
                      <div className="flex flex-col gap-1 border-t pt-2">
                        <span className="text-muted-foreground">Причина:</span>
                        <p className="italic">"{form.getValues("reason")}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className={cn(isMobile && "mt-auto", "flex-col")}>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Назад
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" className="w-full" onClick={nextStep}>
                  Далее
                </Button>
              ) : (
                <>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Создание..." : "Подтвердить"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
