/**
 * @fileoverview Карточка расписания для одного дня недели
 *
 * @module widgets/doctor/doctorScheduleCard/ui/DoctorScheduleCard
 */

import { Card, CardContent, CardHeader, CardTitle, CardAction, CardDescription } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Switch } from "@/shared/ui/switch"
import { FormField, FormControl, FormItem } from "@/shared/ui/form"
import { Plus, Minus, X } from "lucide-react"
import { InputGroup, InputGroupInput } from "@/shared/ui/inputGroup"
import { type Schedule } from "@/entities/schedule/types/schedule.types"
import { useFormContext } from "react-hook-form"
import { useUpdateSchedule } from "@/entities/schedule/api/schedule.queries"


interface DoctorScheduleCardProps {
  schedule: Schedule
  dayIndex: number
  dayLabel: string
}

export const DoctorScheduleCard = ({ schedule, dayIndex, dayLabel }: DoctorScheduleCardProps) => {
  const form = useFormContext()
  const { mutate: updateStatus, isPending } = useUpdateSchedule(schedule.doctorId || "")

  return (
    <Card>
      <CardContent>
        <CardTitle className="text-lg sm:text-xl">{dayLabel}</CardTitle>
        <CardDescription>
          С {schedule.startAt} по {schedule.endAt}
        </CardDescription>
        <CardAction>
          <FormField
            name={`schedule.${dayIndex}.isAvailable`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={field.value}
                    disabled={isPending}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      const scheduleId = form.getValues(`schedule.${dayIndex}.id`)
                      updateStatus({ id: scheduleId, isAvailable: checked })
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardAction>
      </CardContent>
    </Card>
  )
}
