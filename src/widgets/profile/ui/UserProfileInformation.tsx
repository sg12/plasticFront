import type { Props } from "../types/types"
import type { RoleProfile } from "../../../entities/user/types/types"
import { USER_ROLES } from "../../../entities/user/model/constants"
import { Input } from "../../../shared/ui/input"
import { Label } from "../../../shared/ui/label"
import { Button } from "../../../shared/ui/button"
import { Controller, useFormContext } from "react-hook-form"
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "../../../shared/ui/select"
import { useEmailVerification } from "@/features/emailVerification/hooks/useEmailVerification"
import { Lock, Send, CheckCircle, Loader2 } from "lucide-react"

export const UserProfileInformation = ({ profile, isEditing }: Props) => {
  if (!profile) return null

  const { register, watch, control } = useFormContext<RoleProfile>()
  const role = watch("role") ?? profile.role
  const {
    isVerified: emailVerified,
    isSending: emailSending,
    sendVerificationEmail,
  } = useEmailVerification()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-6">Личная информация</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="profile_full_name" className="mb-2 block text-gray-700">
              Полное имя
            </Label>
            <Input
              id="profile_full_name"
              type="text"
              disabled={!isEditing}
              {...register("full_name")}
            />
          </div>

          <div>
            <Label htmlFor="profile_email" className="mb-2 flex items-center gap-2 text-gray-700">
              Email
              {emailVerified && (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  Подтверждён
                </span>
              )}
            </Label>
            <div className="relative">
              <Input
                id="profile_email"
                type="email"
                disabled={emailVerified || !isEditing}
                className={emailVerified ? "bg-gray-50 pr-10" : ""}
                {...register("email")}
              />
              {emailVerified ? (
                <Lock className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={sendVerificationEmail}
                  disabled={emailSending}
                  className="absolute top-1/2 right-1 h-7 -translate-y-1/2 text-xs text-purple-600 hover:text-purple-700"
                >
                  {emailSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      Подтвердить
                    </>
                  )}
                </Button>
              )}
            </div>
            {!emailVerified && (
              <p className="mt-1 text-xs text-amber-600">
                Email не подтверждён. Нажмите "Подтвердить" для отправки письма.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="profile_phone" className="mb-2 block text-gray-700">
              Телефон
            </Label>
            <Input id="profile_phone" type="tel" disabled={!isEditing} {...register("phone")} />
          </div>

          {role === USER_ROLES.PATIENT && (
            <>
              <div>
                <Label htmlFor="profile_birth_date" className="mb-2 block text-gray-700">
                  Дата рождения
                </Label>
                <Input
                  id="profile_birth_date"
                  type="date"
                  disabled={!isEditing}
                  {...register("birth_date")}
                />
              </div>
              <div>
                <Label htmlFor="profile_gender" className="mb-2 block text-gray-700">
                  Пол
                </Label>
                <Controller
                  control={control}
                  name={"gender" as any}
                  render={({ field }) => {
                    const uiValue =
                      field.value === null || field.value === undefined || field.value === ""
                        ? "notspecified"
                        : String(field.value)

                    return (
                      <Select
                        disabled={!isEditing}
                        value={uiValue}
                        onValueChange={(v) => field.onChange(v === "notspecified" ? null : v)}
                      >
                        <SelectTrigger id="profile_gender" className="font-normal">
                          <SelectValue placeholder="Пол" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="male">Мужской</SelectItem>
                          <SelectItem value="female">Женский</SelectItem>
                          <SelectItem value="notspecified">Не указан</SelectItem>
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
              </div>
            </>
          )}

          {role === USER_ROLES.DOCTOR && (
            <>
              <div>
                <Label htmlFor="profile_gender" className="mb-2 block text-gray-700">
                  Пол
                </Label>
                <Controller
                  control={control}
                  name={"gender" as any}
                  render={({ field }) => {
                    const uiValue =
                      field.value === null || field.value === undefined || field.value === ""
                        ? "notspecified"
                        : String(field.value)

                    return (
                      <Select
                        disabled={!isEditing}
                        value={uiValue}
                        onValueChange={(v) => field.onChange(v === "notspecified" ? null : v)}
                      >
                        <SelectTrigger id="profile_gender" className="font-normal">
                          <SelectValue placeholder="Пол" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="male">Мужской</SelectItem>
                          <SelectItem value="female">Женский</SelectItem>
                          <SelectItem value="notspecified">Не указан</SelectItem>
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
              </div>
              <div>
                <Label htmlFor="profile_birth_date" className="mb-2 block text-gray-700">
                  Дата рождения
                </Label>
                <Input
                  id="profile_birth_date"
                  type="date"
                  disabled={!isEditing}
                  {...register("birth_date")}
                />
              </div>
              <div>
                <Label htmlFor="profile_specialization" className="mb-2 block text-gray-700">
                  Специализация
                </Label>
                <Input
                  id="profile_specialization"
                  type="text"
                  disabled={!isEditing}
                  {...register("specialization")}
                />
              </div>
              <div>
                <Label htmlFor="profile_experience" className="mb-2 block text-gray-700">
                  Опыт (лет)
                </Label>
                <Input
                  id="profile_experience"
                  type="number"
                  disabled={!isEditing}
                  {...register("experience", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="profile_education" className="mb-2 block text-gray-700">
                  Образование
                </Label>
                <Input
                  id="profile_education"
                  type="text"
                  disabled={!isEditing}
                  {...register("education")}
                />
              </div>
            </>
          )}

          {role === USER_ROLES.CLINIC && (
            <>
              <div>
                <Label htmlFor="profile_legal_name" className="mb-2 block text-gray-700">
                  Юр. название
                </Label>
                <Input
                  id="profile_legal_name"
                  type="text"
                  disabled={!isEditing}
                  {...register("legal_name")}
                />
              </div>
              <div>
                <Label htmlFor="profile_clinic_inn" className="mb-2 block text-gray-700">
                  ИНН
                </Label>
                <Input
                  id="profile_clinic_inn"
                  type="text"
                  disabled={!isEditing}
                  {...register("clinic_inn")}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
