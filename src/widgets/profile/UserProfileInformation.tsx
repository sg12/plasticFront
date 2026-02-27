import { type UseFormReturn } from "react-hook-form"
import { CheckCircle, Mail, UserIcon, Phone } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Badge } from "@/shared/ui/badge"
import { Separator } from "@/shared/ui/separator"
import { CardTitle } from "@/shared/ui/card"
import type { User } from "@/entities/user/types/user.types"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import type { UpdateUserDto } from "@/entities/user/model/user.schema"
import { PatientForm } from "../patient/PatientForm"
import { DoctorForm } from "../doctor/DoctorForm"
import { ClinicForm } from "../clinic/ClinicForm"

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
                    <InputGroupInput id="fullName" placeholder="Фамилия Имя Отчество" {...field} />
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
                </FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                    <InputGroupInput id="email" placeholder="Email" {...field} />
                    {user?.auth.confirmed && (
                      <InputGroupAddon align="inline-end">
                        <Badge variant="outline">
                          <CheckCircle />
                          <span className="max-md:hidden">
                            Подтверждён
                          </span>
                        </Badge>
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
