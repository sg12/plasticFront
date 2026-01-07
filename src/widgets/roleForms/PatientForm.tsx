import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { CalendarDays } from "lucide-react"
import type { Props } from "./types/types"
import { patientFields } from "@/widgets/roleForms/model/constants"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/shared/ui/calendar"

export const PatientForm = ({ mode = "edit", form, isSaving }: Props) => {
  const isViewMode = mode === "view" || isSaving

  let eighteenYearsAgo = new Date()
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      {patientFields.map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          disabled={isViewMode}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.optional && (
                  <span className="text-muted-foreground text-xs font-normal italic">
                    {" (опционально)"}
                  </span>
                )}
              </FormLabel>
              <FormControl>
                {field.type === "select" ? (
                  <Select
                    onValueChange={formField.onChange}
                    value={formField.value ?? ""}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue
                        id={field.id}
                        placeholder={`Выберите ${field.label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options!.map((opt) => (
                        <SelectItem key={opt.value} id={field.id} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  field.type === "date" && (
                    <Popover>
                      <PopoverTrigger asChild disabled={isViewMode}>
                        <InputGroup>
                          <InputGroupAddon>
                            <CalendarDays />
                          </InputGroupAddon>
                          <InputGroupInput
                            readOnly
                            id={field.id}
                            disabled={isViewMode}
                            className="cursor-pointer"
                            placeholder="Выберите дату"
                            value={
                              formField.value ? format(new Date(formField.value), "dd.MM.yyyy") : ""
                            }
                          />
                        </InputGroup>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          defaultMonth={
                            formField.value ? new Date(formField.value) : eighteenYearsAgo
                          }
                          selected={formField.value ? new Date(formField.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              // Нормализуем дату при выборе, чтобы избежать проблем с часовыми поясами
                              const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                              formField.onChange(normalized)
                            } else {
                              formField.onChange(undefined)
                            }
                          }}
                          captionLayout="dropdown"
                          disabled={[
                            {
                              after: new Date(
                                new Date().setFullYear(new Date().getFullYear() - 18),
                              ),
                            },
                            { before: new Date(1920, 0, 1) },
                          ]}
                        />
                      </PopoverContent>
                    </Popover>
                  )
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}
