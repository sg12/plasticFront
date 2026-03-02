/**
 * @fileoverview Форма для редактирования расписания врача
 *
 */

import { DoctorScheduleCard } from "@/widgets/doctor/DoctorScheduleCard"
import { DAYS_OF_WEEK } from "@/shared/model/constants"
import { useMe } from "@/entities/user/api/user.queries"
import { FormProvider, useForm } from "react-hook-form"

export const DoctorScheduleForm = () => {
  const { data: user, isLoading } = useMe()

  const form = useForm({
    defaultValues: {
      schedule: user?.doctor?.schedules || []
    }
  })

  if (isLoading) return <div>Загрузка...</div>

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label || `День ${dayOfWeek}`
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {user?.doctor.schedules.map((schedule, index) => (
            <DoctorScheduleCard
              key={schedule.id}
              schedule={schedule}
              dayIndex={index}
              dayLabel={getDayLabel(schedule.dayOfWeek)}
            />
          ))}
        </div>
      </form>
    </FormProvider>
  )
}
