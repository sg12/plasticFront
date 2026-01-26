import type { RoleProfile } from "../../../entities/user/types/types"
import { USER_ROLES } from "../../../entities/user/model/constants"
import { type UseFormReturn } from "react-hook-form"
import { Lock, CheckCircle, Mail, User, Phone } from "lucide-react"
import { useAuthStore } from "@/entities/auth/model/store"
import { PatientForm } from "@/widgets/roleForms/PatientForm"
import { DoctorForm } from "@/widgets/roleForms/DoctorForm"
import { ClinicForm } from "@/widgets/roleForms/ClinicForm"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Badge } from "@/shared/ui/badge"
import { Separator } from "@/shared/ui/separator"
import { CardTitle } from "@/shared/ui/card"

export interface Props {
  form: UseFormReturn<any>
  profile: RoleProfile | null
  isEditing?: boolean
  isSaving?: boolean
}

export const UserProfileInformation = ({ form, profile, isEditing, isSaving }: Props) => {
  const { user } = useAuthStore()
  if (!profile) return null

  return (
    <>
      <CardTitle className="mb-4">Личная информация</CardTitle>

      <div className="space-child">
        {/* Основная информация - ФИО, Email, телефон */}
        <div className="grid gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            disabled={!isEditing || isSaving}
            name={"fullName"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Полное имя</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <User />
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
            disabled={user?.user_metadata.email_verified || !isEditing || isSaving}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email{" "}
                  {user?.user_metadata.email_verified && (
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
                    {user?.user_metadata.email_verified && (
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
                    <InputGroupAddon>
                      <Phone />
                    </InputGroupAddon>
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
        {profile.role === USER_ROLES.PATIENT && (
          <PatientForm form={form} mode={isEditing ? "edit" : "view"} isSaving={isSaving} />
        )}
        {profile.role === USER_ROLES.DOCTOR && (
          <DoctorForm form={form} mode={isEditing ? "edit" : "view"} isSaving={isSaving} />
        )}
        {profile.role === USER_ROLES.CLINIC && (
          <ClinicForm form={form} mode={isEditing ? "edit" : "view"} isSaving={isSaving} />
        )}
      </div>
    </>
  )
}