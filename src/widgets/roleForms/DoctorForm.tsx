import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/shared/ui/inputGroup"
import {
  Select,
  SelectContent,
  SelectGroupAddon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { FileText, Building2, VenusAndMars, Copy, Check } from "lucide-react"
import type { Props } from "./types/types"
import { Switch } from "@/shared/ui/switch"
import { doctorFields } from "@/widgets/roleForms/model/constants"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/entities/auth/model/store"
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
import { SelectBirthDate } from "@/features/selectBirthDate/ui/SelectBirthDate"

export const DoctorForm = ({ mode = "edit", form, isSaving }: Props) => {
  const isViewMode = mode === "view" || !!isSaving
  const [worksInClinic, setWorksInClinic] = useState(false)
  const { user } = useAuthStore()
  const { copy: copyId, copied } = useClipboard(user?.id, {
    successMessage: "ID скопирован в буфер обмена",
    errorMessage: "Не удалось скопировать ID",
  })

  const location = useLocation()
  const clinicValue = form.watch("clinic")
  useEffect(() => {
    setWorksInClinic(!!clinicValue)
  }, [clinicValue])

  const handleWorksInClinicChange = (checked: boolean) => {
    setWorksInClinic(checked)
    if (checked) {
      form.setValue("workplace", "")
    }
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
                    value={formField.value || ""}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectGroupAddon>
                        <VenusAndMars />
                        <SelectValue placeholder="Выберите пол" id={field.id} />
                      </SelectGroupAddon>
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
                  <SelectBirthDate isViewMode={isViewMode} field={field} formField={formField} />
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
                      disabled={
                        isViewMode ||
                        (field.name === "workplace" && worksInClinic) ||
                        formField.value === null
                      }
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
