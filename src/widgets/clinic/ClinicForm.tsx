import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { FileText } from "lucide-react"
import type { ProfileProps } from "@/entities/profile/types/profile.types"
import { clinicFields } from "@/entities/profile/model/profile.constants"

export const ClinicForm = ({ form, mode = "edit", isSaving }: ProfileProps) => {
  const isViewMode = mode === "view" || isSaving

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {clinicFields.map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          disabled={isViewMode}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <FileText />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.id}
                    placeholder={field.placeholder}
                    {...formField}
                    value={formField.value}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}
