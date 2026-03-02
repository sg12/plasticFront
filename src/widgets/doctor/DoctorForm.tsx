import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/shared/ui/inputGroup"
import {
  Select,
  SelectContent,
  SelectGroupAddon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { FileText, Building2, VenusAndMars, Copy, Check, GraduationCap, Briefcase } from "lucide-react"
import { Switch } from "@/shared/ui/switch"
import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { useClipboard } from "@/shared/hooks/useClipboard"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item"
import { useLocation } from "react-router"
import { ROUTES } from "@/shared/model/routes"
import { SelectBirthDate } from "@/features/user-management/profile/create/ui/selectBirthDate/ui/SelectBirthDate"
import { useMe } from "@/entities/user/api/user.queries"
import type { FormInputProps } from "@/entities/profile/types/profile.types"
import { doctorFields } from "@/entities/profile/model/profile.constants"

export const DoctorForm = ({ mode = "edit", form, isSaving }: FormInputProps) => {
  const isViewMode = mode === "view" || !!isSaving
  const { data: user } = useMe()
  const { copy: copyId, copied } = useClipboard(user?.id, {
    successMessage: "ID скопирован",
  })

  const location = useLocation()
  const clinicValue = form.watch("doctor.clinic")
  const [worksInClinic, setWorksInClinic] = useState(() => !!clinicValue)

  const handleWorksInClinicChange = (checked: boolean) => {
    setWorksInClinic(checked)
    if (checked) {
      form.setValue("doctor.workplace", "")
    } else {
      form.setValue("doctor.clinic", null)
    }
  }

  const getFieldIcon = (name: string) => {
    if (name.includes("inn")) return <FileText className="size-4" />
    if (name.includes("education")) return <GraduationCap className="size-4" />
    if (name.includes("experience") || name.includes("workplace")) return <Briefcase className="size-4" />
    return <FileText className="size-4" />
  }

  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      {location.pathname === ROUTES.CREATE_PROFILE && (
        <label htmlFor="works-in-clinic" className="md:col-span-2">
          <Item variant="muted" className="cursor-pointer">
            <ItemMedia>
              <Building2 className="h-5 w-5 text-gray-600" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Работаю в клинике</ItemTitle>
              <ItemDescription>Ваша клиника должна добавить вас после регистрации</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch
                id="works-in-clinic"
                checked={worksInClinic}
                onCheckedChange={handleWorksInClinicChange}
                disabled={isViewMode}
              />
            </ItemActions>
            {worksInClinic && user?.id && (
              <ItemFooter className="flex-col items-stretch gap-2">
                <FormItem className="w-full">
                  <FormControl>
                    <InputGroup onClick={copyId}>
                      <InputGroupAddon>
                        <InputGroupText className="font-mono">ID:</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        readOnly
                        value={user.id}
                        className="font-mono select-none touch-none"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button type="button" variant="ghost" size="iconSm" onClick={copyId}>
                          {copied ? (
                            <Check className="size-4 text-green-600" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Скопируйте этот ID и отправьте клинике для добавления вас в список врачей
                  </p>
                </FormItem>
              </ItemFooter>
            )}
          </Item>
        </label>
      )}

      {doctorFields.map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <FormLabel>
                {field.label}
                {field.optional && <span className="text-muted-foreground text-xs font-normal italic"> (опц.)</span>}
              </FormLabel>
              <FormControl>
                {(() => {
                  switch (field.type) {
                    case "select":
                      return (
                        <Select
                          onValueChange={formField.onChange}
                          value={formField.value ?? ""}
                          disabled={isViewMode}
                        >
                          <SelectTrigger>
                            <SelectGroupAddon>
                              <VenusAndMars className="size-4" />
                              <SelectValue placeholder="Выберите пол" />
                            </SelectGroupAddon>
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )

                    case "date":
                      return (
                        <SelectBirthDate
                          isViewMode={isViewMode}
                          field={field}
                          formField={formField}
                        />
                      )

                    case "textarea":
                      return (
                        <InputGroup>
                          <InputGroupTextarea
                            {...formField}
                            value={formField.value ?? ""}
                            placeholder={field.placeholder}
                            disabled={isViewMode}
                          />
                        </InputGroup>
                      )

                    case "multi-select": {
                      const selectedValues: string[] = Array.isArray(formField.value) ? formField.value : [];

                      const toggleValue = (value: string) => {
                        const isSelected = selectedValues.includes(value);
                        if (isSelected) {
                          formField.onChange(selectedValues.filter((v) => v !== value));
                        } else {
                          formField.onChange([...selectedValues, value]);
                        }
                      };

                      return (
                        <Select disabled={isViewMode}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectGroupAddon>
                                <Briefcase className="size-4" />
                                <SelectValue placeholder={
                                  selectedValues.length > 0
                                    ? `Выбрано: ${selectedValues.length}`
                                    : field.placeholder || "Выберите специализации"
                                } />

                              </SelectGroupAddon>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {field.options?.map((opt) => {
                              const isSelected = selectedValues.includes(opt.value);
                              return (
                                <div
                                  key={opt.value}
                                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleValue(opt.value);
                                  }}
                                >
                                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                    {isSelected && <Check className="size-4 text-primary" />}
                                  </span>
                                  <span className={isSelected ? "font-medium text-primary" : ""}>
                                    {opt.label}
                                  </span>
                                </div>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      );
                    }

                    default:
                      return (
                        <InputGroup>
                          <InputGroupAddon>
                            {getFieldIcon(field.name)}
                          </InputGroupAddon>
                          <InputGroupInput
                            {...formField}
                            type={field.type}
                            value={formField.value ?? ""}
                            placeholder={field.placeholder}
                            disabled={
                              isViewMode ||
                              (field.name === "doctor.workplace" && worksInClinic)
                            }
                            onChange={(e) =>
                              field.type === "number"
                                ? formField.onChange(e.target.valueAsNumber || 0)
                                : formField.onChange(e.target.value)
                            }
                          />
                        </InputGroup>
                      )
                  }
                })()}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}