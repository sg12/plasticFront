import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import {
  Select,
  SelectContent,
  SelectGroupAddon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Mars, Venus, VenusAndMars } from "lucide-react"
import type { Props } from "./types/types"
import { patientFields } from "@/widgets/roleForms/model/constants"
import { SelectBirthDate } from "@/features/selectBirthDate/ui/SelectBirthDate"
import { USER_GENDER } from "@/entities/user/model/user.constants"

export const PatientForm = ({ mode = "edit", form, isSaving }: Props) => {
  const isViewMode = mode === "view" || !!isSaving

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
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
                      value={formField.value ?? undefined}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectGroupAddon>
                          {formField.value === USER_GENDER.MALE ? (
                            <Mars />
                          ) : formField.value === USER_GENDER.FEMALE ? (
                            <Venus />
                          ) : (
                            <VenusAndMars />
                          )}
                          <SelectValue
                            id={field.id}
                            placeholder={`Выберите ${field.label.toLowerCase()}`}
                          />
                        </SelectGroupAddon>
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
                    field.type === "date" &&
                    <SelectBirthDate isViewMode={isViewMode} field={field} formField={formField} />
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
