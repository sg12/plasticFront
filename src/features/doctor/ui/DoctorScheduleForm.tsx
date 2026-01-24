/**
 * @fileoverview Форма для редактирования расписания врача
 *
 * @module features/doctor/ui/DoctorScheduleForm
 */

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import {
  MIN_APPOINTMENT_DURATION,
  MAX_APPOINTMENT_DURATION,
} from "@/entities/appointments/model/constants"
import { DoctorScheduleCard } from "@/widgets/doctor/doctorScheduleCard/ui/DoctorScheduleCard"
import { DAYS_OF_WEEK } from "@/shared/model/constants"
import { useDoctorScheduleForm } from "../hooks/useDoctorScheduleForm"

export const DoctorScheduleForm = () => {
  const { form, fields, isLoadingSchedule, onSubmit } = useDoctorScheduleForm()

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label || `День ${dayOfWeek}`
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-global">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold sm:text-3xl">Расписание приёма</h3>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Настройте расписание работы и доступные временные слоты для записи пациентов
            </p>
          </div>
          <Button type="submit" disabled={isLoadingSchedule} className="w-full sm:w-auto">
            Сохранить расписание
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((_, index) => (
            <DoctorScheduleCard
              key={fields[index].id}
              dayIndex={index}
              dayLabel={getDayLabel(form.watch(`schedule.${index}.dayOfWeek`))}
            />
          ))}
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="defaultDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Длительность приёма по умолчанию (минуты)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={MIN_APPOINTMENT_DURATION}
                    max={MAX_APPOINTMENT_DURATION}
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Стандартная длительность одного приёма ({MIN_APPOINTMENT_DURATION} -{" "}
                  {MAX_APPOINTMENT_DURATION} минут)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minHoursBeforeAppointment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Минимальное время до записи (часы)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Пациенты смогут записаться минимум за это количество часов до приёма
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
