import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { CalendarDays, FileText, Building2 } from "lucide-react"
import { format } from "date-fns"
import type { Props } from "./types/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { Calendar } from "@/shared/ui/calendar"
import { Switch } from "@/shared/ui/switch"
import { doctorFields } from "@/widgets/roleForms/model/constants"
import { useState, useEffect } from "react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item"

export const DoctorForm = ({ mode = "edit", form, isSaving }: Props) => {
  const isViewMode = mode === "view" || isSaving
  const [worksInClinic, setWorksInClinic] = useState(false)

  let eighteenYearsAgo = new Date()
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)

  const clinicValue = form.watch("clinic")
  useEffect(() => {
    setWorksInClinic(!!clinicValue)
  }, [clinicValue])

  // Обработчик изменения toggle
  const handleWorksInClinicChange = (checked: boolean) => {
    setWorksInClinic(checked)
    if (checked) {
      form.setValue("workplace", "")
    }
  }

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <label htmlFor="works-in-clinic" className="md:col-span-2">
        <Item variant="muted" className="cursor-pointer">
          <ItemMedia>
            <Building2 className="h-5 w-5 text-gray-600" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Работаю в клинике</ItemTitle>
            <ItemDescription>Клиника будет добавлена через систему приглашений</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch
              id="works-in-clinic"
              checked={worksInClinic}
              onCheckedChange={handleWorksInClinicChange}
              disabled={isViewMode}
            />
          </ItemActions>
        </Item>
      </label>

      {doctorFields.map((field) => (
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
                    value={formField.value}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите пол" id={field.id} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options!.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} id={field.id}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "date" ? (
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
                          value={formField.value ? format(formField.value, "dd.MM.yyyy") : ""}
                        />
                      </InputGroup>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        defaultMonth={
                          formField.value ? new Date(formField.value) : eighteenYearsAgo
                        }
                        selected={formField.value ? new Date(formField.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            formField.onChange(format(date, "yyyy-MM-dd"))
                          }
                        }}
                        captionLayout="dropdown"
                        disabled={[
                          {
                            after: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
                          },
                          { before: new Date(1920, 0, 1) },
                        ]}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <InputGroup>
                    <InputGroupAddon>
                      <FileText />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.id}
                      type={field.type === "number" ? "number" : "text"}
                      placeholder={field.placeholder}
                      {...formField}
                      value={formField.value}
                      disabled={isViewMode || (field.name === "workplace" && worksInClinic)}
                      onChange={(e) =>
                        field.type === "number"
                          ? formField.onChange(e.target.valueAsNumber || 0)
                          : formField.onChange(e)
                      }
                    />
                  </InputGroup>
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
