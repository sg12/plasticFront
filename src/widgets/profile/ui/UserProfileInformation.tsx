import { type UseFormReturn } from "react-hook-form"
import { Lock, CheckCircle, Mail, UserIcon, Phone } from "lucide-react"
import { PatientForm } from "@/widgets/roleForms/PatientForm"
import { DoctorForm } from "@/widgets/roleForms/DoctorForm"
import { ClinicForm } from "@/widgets/roleForms/ClinicForm"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Badge } from "@/shared/ui/badge"
import { Separator } from "@/shared/ui/separator"
import { CardTitle } from "@/shared/ui/card"
import type { User } from "@/entities/user/types/user.types"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import type { UpdateUserDto } from "@/entities/user/model/user.schema"

export interface Props {
  form: UseFormReturn<UpdateUserDto>
  user: User
  isEditing?: boolean
  isSaving?: boolean
}

export const UserProfileInformation = ({ form, user, isEditing, isSaving }: Props) => {
  if (!user) return null

  return (
    <>
      <CardTitle className="mb-4">Личная информация</CardTitle>

      <div className="space-child">
        {/* Основная информация - ФИО, Email, телефон */}
        <div className="grid gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            disabled={!isEditing || isSaving}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Полное имя</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <UserIcon />
                    </InputGroupAddon>
                    <InputGroupInput id="full_name" placeholder="Фамилия Имя Отчество" {...field} />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            disabled={user?.auth.confirmed || !isEditing || isSaving}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email
                  {user?.auth.confirmed && (
                    <Badge variant="accent">
                      <CheckCircle className="h-3 w-3" />
                      Подтверждён
                    </Badge>
                  )}
                </FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                    <InputGroupInput id="email" placeholder="Email" {...field} />
                    {user?.auth.confirmed && (
                      <InputGroupAddon align="inline-end">
                        <Lock className="opacity-50" />
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            disabled={!isEditing || isSaving}
            name={"phone"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon><Phone /></InputGroupAddon>
                    <InputGroupInput id="phone" placeholder="+7 (999) 999-99-99" {...field} />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        {/* Ролевая информация */}
        {user.role === USER_ROLE.PATIENT && (
          <PatientForm form={form} mode={isEditing ? "edit" : "view"} isSaving={isSaving} />
        )}
        {user.role === USER_ROLE.DOCTOR && (
          <DoctorForm form={form} mode={isEditing ? "edit" : "view"} isSaving={isSaving} />
        )}
        {user.role === USER_ROLE.CLINIC && (
          <ClinicForm form={form} mode={isEditing ? "edit" : "view"} isSaving={isSaving} />
        )}
      </div>
    </>
  )
}
