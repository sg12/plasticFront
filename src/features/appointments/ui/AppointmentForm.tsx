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
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radioGroup"
import { useAppointmentsStore } from "@/entities/appointments/model/store"
import { createAppointmentSchema } from "@/entities/appointments/model/schema"
import type { AppointmentCreateData } from "@/entities/appointments/types/types"
import {
    APPOINTMENT_TYPE,
    APPOINTMENT_TYPE_LABELS,
    DEFAULT_APPOINTMENT_DURATION,
    MIN_HOURS_BEFORE_APPOINTMENT,
} from "@/entities/appointments/model/constants"
import { AppointmentCalendarWithTime } from "@/features/appointments/ui/AppointmentCalendarWithTime"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/shared/lib/utils"
import { useUserStore } from "@/entities/user/model/store"
import { Item, ItemTitle } from "@/shared/ui/item"
import { useIsMobile } from "@/shared/hooks/useMobile"

interface AppointmentFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    doctorId?: string | null
    clinicId?: string | null
    onSuccess?: () => void
}

export const AppointmentForm = ({
    open,
    onOpenChange,
    doctorId,
    clinicId,
    onSuccess,
}: AppointmentFormProps) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const { isLoading, createNewAppointment, loadAvailableTimeSlots } = useAppointmentsStore()
    const { profile } = useUserStore()
    const isMobile = useIsMobile()

    const form = useForm<AppointmentCreateData>({
        resolver: zodResolver(createAppointmentSchema),
        defaultValues: {
            doctorId: doctorId || null,
            clinicId: clinicId || null,
            type: APPOINTMENT_TYPE.CONSULTATION,
            dateTime: "",
            duration: undefined,
            reason: null,
            notes: null,
        },
    })

    const watchedType = form.watch("type")

    useEffect(() => {
        if (!open) {
            form.reset({
                doctorId: doctorId || null,
                clinicId: clinicId || null,
                type: APPOINTMENT_TYPE.CONSULTATION,
                dateTime: "",
                duration: undefined,
                reason: null,
                notes: null,
                contactPhone: null,
            })
            setCurrentStep(0)
            setSelectedDate(null)
        }
    }, [open, form, doctorId, clinicId])

    useEffect(() => {
        if (selectedDate && (doctorId || clinicId)) {
            const dateStr = format(selectedDate, "yyyy-MM-dd")
            loadAvailableTimeSlots(doctorId || null, clinicId || null, dateStr)
        }
    }, [selectedDate, doctorId, clinicId, loadAvailableTimeSlots])

    useEffect(() => {
        if (watchedType && watchedType in DEFAULT_APPOINTMENT_DURATION) {
            form.setValue(
                "duration",
                DEFAULT_APPOINTMENT_DURATION[watchedType as keyof typeof DEFAULT_APPOINTMENT_DURATION],
            )
        }
    }, [watchedType, form])

    const onSubmit = async (data: AppointmentCreateData) => {
        await createNewAppointment(data)
        onSuccess?.()
        onOpenChange(false)
    }

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date)
            const currentDateTime = form.getValues("dateTime")
            if (currentDateTime) {
                const currentDate = new Date(currentDateTime)
                const newDateTime = new Date(date)
                newDateTime.setHours(currentDate.getHours(), currentDate.getMinutes(), 0, 0)
                form.setValue("dateTime", newDateTime.toISOString())
            } else {
                form.setValue("dateTime", "")
            }
        }
    }

    const handleTimeSlotSelect = (startTime: string) => {
        if (selectedDate) {
            const [hours, minutes] = startTime.split(":").map(Number)
            const dateTime = new Date(selectedDate)
            dateTime.setHours(hours, minutes, 0, 0)
            form.setValue("dateTime", dateTime.toISOString())
        }
    }

    const steps = [
        {
            id: 1,
            label: "Тип приёма",
            description: "Выберите тип приёма",
        },
        {
            id: 2,
            label: "Дата и время",
            description: "Выберите удобную дату и время",
        },
        {
            id: 3,
            label: "Информация",
            description: "Заполните дополнительную информацию",
        },
        {
            id: 4,
            label: "Подтверждение",
            description: "Проверьте данные перед подтверждением",
        },
    ]

    const nextStep = async () => {
        if (currentStep === 0) {
            const isValid = await form.trigger("type")
            if (!isValid) return
        } else if (currentStep === 1) {
            const dateTime = form.getValues("dateTime")
            if (!dateTime) {
                form.setError("dateTime", {
                    type: "required",
                    message: "Выберите дату и время приёма",
                })
                return
            }
            // Проверяем формат и валидность даты через отдельную валидацию
            try {
                const date = new Date(dateTime)
                if (isNaN(date.getTime())) {
                    form.setError("dateTime", {
                        type: "validation",
                        message: "Неверный формат даты и времени",
                    })
                    return
                }
                const now = new Date()
                if (date <= now) {
                    form.setError("dateTime", {
                        type: "validation",
                        message: "Дата приёма должна быть в будущем",
                    })
                    return
                }
                const minDate = new Date(now.getTime() + MIN_HOURS_BEFORE_APPOINTMENT * 60 * 60 * 1000)
                if (date < minDate) {
                    form.setError("dateTime", {
                        type: "validation",
                        message: `Запись возможна минимум за ${MIN_HOURS_BEFORE_APPOINTMENT} часа до приёма`,
                    })
                    return
                }
                form.clearErrors("dateTime")
            } catch (error) {
                form.setError("dateTime", {
                    type: "validation",
                    message: "Неверный формат даты и времени",
                })
                return
            }
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(isMobile && "flex flex-col p-0")}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={cn("space-child", isMobile && "flex h-full flex-col p-6")}
                    >
                        <div className={cn(isMobile && "flex-1 overflow-y-auto")}>
                            <DialogHeader className="mb-4">
                                <DialogTitle>{steps[currentStep].label}</DialogTitle>
                                <DialogDescription>{steps[currentStep].description}</DialogDescription>
                            </DialogHeader>

                            {/* <StepIndicator steps={steps} currentStep={currentStep} /> */}

                            {currentStep === 0 && (
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <>
                                                    <RadioGroup
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        className="grid grid-cols-1 gap-4"
                                                    >
                                                        {Object.entries(APPOINTMENT_TYPE_LABELS).map(([value, label]) => (
                                                            <div
                                                                key={value}
                                                                className={cn(
                                                                    "flex items-start space-x-3 rounded-lg border p-3 transition-all",
                                                                    value === field.value
                                                                        ? "border-violet-500 bg-violet-50"
                                                                        : "border-gray-200 hover:border-violet-300",
                                                                )}
                                                            >
                                                                <RadioGroupItem value={value} id={value} className="mt-1" />
                                                                <label htmlFor={value} className="flex-1 cursor-pointer">
                                                                    {label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                    <Item variant="muted">
                                                        <ItemTitle>Со временем добавим другие типы приёма</ItemTitle>
                                                    </Item>
                                                </>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {currentStep === 1 && (
                                <FormField
                                    control={form.control}
                                    name="dateTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <AppointmentCalendarWithTime
                                                    selectedDate={selectedDate}
                                                    onSelectDate={handleDateSelect}
                                                    selectedTime={field.value}
                                                    onSelectTime={handleTimeSlotSelect}
                                                    doctorId={doctorId || null}
                                                    clinicId={clinicId || null}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {currentStep === 2 && (
                                <div className="space-child">
                                    <FormField
                                        control={form.control}
                                        name="reason"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Причина обращения (необязательно)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Опишите причину обращения"
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

                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Комментарии/пожелания (необязательно)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Дополнительная информация"
                                                        {...field}
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-child">
                                    <div className="rounded-lg border p-4">
                                        <h3 className="mb-4 font-semibold">Сводка записи</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">Тип приёма:</span>
                                                <span className="border-muted-foreground/30 flex-1 border-b border-dashed" />
                                                <span>
                                                    {
                                                        APPOINTMENT_TYPE_LABELS[
                                                        form.getValues("type") as keyof typeof APPOINTMENT_TYPE_LABELS
                                                        ]
                                                    }
                                                </span>
                                            </div>
                                            {form.getValues("dateTime") && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">Дата:</span>
                                                        <span className="border-muted-foreground/30 flex-1 border-b border-dashed"></span>
                                                        <span>
                                                            {format(new Date(form.getValues("dateTime")), "d MMMM yyyy, EEEE", {
                                                                locale: ru,
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">Время:</span>
                                                        <span className="border-muted-foreground/30 flex-1 border-b border-dashed"></span>
                                                        <span>{format(new Date(form.getValues("dateTime")), "HH:mm")}</span>
                                                    </div>
                                                </>
                                            )}
                                            {form.getValues("reason") && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Причина:</span>
                                                    <span className="border-muted-foreground/30 flex-1 border-b border-dashed"></span>
                                                    <span>{form.getValues("reason")}</span>
                                                </div>
                                            )}
                                            {profile && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Телефон:</span>
                                                    <span className="border-muted-foreground/30 flex-1 border-b border-dashed"></span>
                                                    <span>{profile.phone}</span>
                                                </div>
                                            )}
                                            {form.getValues("notes") && (
                                                <div className="flex items-center gap-2 text-right">
                                                    <span className="text-muted-foreground">Комментарии:</span>
                                                    <span className="border-muted-foreground/30 flex-1 border-b border-dashed"></span>
                                                    <span>{form.getValues("notes")}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className={cn(isMobile && "mt-auto")}>
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
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        Подтвердить запись
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
