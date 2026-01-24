/**
 * @fileoverview Карточка расписания для одного дня недели
 *
 * @module widgets/doctor/doctorScheduleCard/ui/DoctorScheduleCard
 */

import { useFieldArray, useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Switch } from "@/shared/ui/switch"
import { FormField, FormControl, FormItem, FormMessage } from "@/shared/ui/form"
import { Plus, Minus } from "lucide-react"
import type { FieldValues } from "react-hook-form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"

interface DoctorScheduleCardProps {
  dayIndex: number
  dayLabel: string
}

export const DoctorScheduleCard = ({ dayIndex, dayLabel }: DoctorScheduleCardProps) => {
  const form = useFormContext<FieldValues>()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `schedule.${dayIndex}.timeRanges`,
  })

  const isAvailable = form.watch(`schedule.${dayIndex}.isAvailable`)

  const addTimeRange = () => {
    append({
      startTime: "09:00",
      endTime: "17:00",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{dayLabel}</CardTitle>
          <CardAction>
            <FormField
              control={form.control}
              name={`schedule.${dayIndex}.isAvailable`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {fields.length === 0 ? (
          <div className="rounded-xl border border-dashed p-3 text-center">
            <p className="text-muted-foreground text-sm">Нет временных диапазонов</p>
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((_, rangeIndex) => {
              return (
                <div key={fields[rangeIndex].id} className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name={`schedule.${dayIndex}.timeRanges.${rangeIndex}.startTime`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>C</InputGroupAddon>
                            <InputGroupInput type="time" disabled={!isAvailable} {...field} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`schedule.${dayIndex}.timeRanges.${rangeIndex}.endTime`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>по</InputGroupAddon>
                            <InputGroupInput
                              id="time-picker"
                              type="time"
                              disabled={!isAvailable}
                              {...field}
                            />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="iconMd"
                      onClick={() => remove(rangeIndex)}
                      disabled={!isAvailable}
                      className="shrink-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addTimeRange}
          disabled={!isAvailable}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить диапазон
        </Button>
      </CardContent>
    </Card>
  )
}
