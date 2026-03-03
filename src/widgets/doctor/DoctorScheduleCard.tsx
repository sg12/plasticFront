/**
 * @fileoverview Карточка расписания для одного дня недели
 */

import { Card, CardContent, CardTitle } from "@/shared/ui/card"
import { Switch } from "@/shared/ui/switch"
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { type Schedule } from "@/entities/schedule/types/schedule.types"
import { useFormContext } from "react-hook-form"
import { useUpdateSchedule } from "@/entities/schedule/api/schedule.queries"
import { DAYS_OF_WEEK } from "@/shared/model/constants"
import { InputGroup, InputGroupInput } from "@/shared/ui/inputGroup"
import { Timer } from "lucide-react"

export const DoctorScheduleCard = ({ schedule, index }: { schedule: Schedule, index: number }) => {
  const form = useFormContext()
  const { mutate: update, isPending } = useUpdateSchedule(schedule.doctorId!)

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find((day) => day.value === dayOfWeek)?.label || `День ${dayOfWeek}`
  }

  const isAvailable = form.watch(`schedule.${index}.isAvailable`)

  const handlePartialUpdate = async () => {
    const isValid = await form.trigger(`schedule.${index}`)

    if (isValid) {
      const values = form.getValues(`schedule.${index}`)

      const hasChanges =
        values.isAvailable !== schedule.isAvailable ||
        values.startAt !== schedule.startAt ||
        values.endAt !== schedule.endAt ||
        Number(values.slotDuration) !== schedule.slotDuration

      if (!hasChanges) return

      update({
        id: schedule.id,
        updateScheduleDto: {
          isAvailable: values.isAvailable,
          startAt: values.startAt,
          endAt: values.endAt,
          slotDuration: Number(values.slotDuration)
        }
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handlePartialUpdate()
    }
  }

  return (
    <Card className={!isAvailable ? "opacity-70 grayscale-[0.3]" : ""} >
      <CardContent className="space-global">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">
            {getDayLabel(schedule.dayOfWeek)}
          </CardTitle>

          <FormField
            control={form.control}
            name={`schedule.${index}.isAvailable`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={field.value}
                    disabled={isPending}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      if (checked !== schedule.isAvailable) {
                        update({ id: schedule.id, updateScheduleDto: { isAvailable: checked } })
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`schedule.${index}.startAt`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      type="time"
                      disabled={!isAvailable || isPending}
                      {...field}
                      onBlur={handlePartialUpdate}
                      onKeyDown={handleKeyDown}
                    />
                  </InputGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`schedule.${index}.endAt`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      type="time"
                      disabled={!isAvailable || isPending}
                      {...field}
                      onBlur={handlePartialUpdate}
                      onKeyDown={handleKeyDown}
                    />
                  </InputGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={`schedule.${index}.slotDuration`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground flex items-center gap-1">
                <Timer className="w-3 h-3" /> Длительность (мин)
              </FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    step={5}
                    min={5}
                    max={120}
                    placeholder="30"
                    disabled={!isAvailable || isPending}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    onBlur={handlePartialUpdate}
                    onKeyDown={handleKeyDown}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
