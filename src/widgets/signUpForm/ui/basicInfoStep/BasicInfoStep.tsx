import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Label } from "@/shared/ui/label"
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import type { SignUpFormData } from "@/features/signUp/model/types"

export function BasicInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignUpFormData>()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <>
      <div>
        <Label htmlFor="fullName" className="mb-2 text-gray-700">
          Фамилия Имя Отчество
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupInput
            id="fullName"
            {...register("basic.fullName")}
            placeholder="Иванов Иван Иванович"
          />
        </InputGroup>
        {errors.basic?.fullName && (
          <p className="text-sm text-red-500">{errors.basic.fullName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="email" className="mb-2 text-gray-700">
            Email
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Mail />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              {...register("basic.email")}
              placeholder="example@mail.ru"
            />
          </InputGroup>
          {errors.basic?.email && (
            <p className="text-sm text-red-500">{errors.basic.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="mb-2 text-gray-700">
            Телефон
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Phone />
            </InputGroupAddon>
            <InputGroupInput
              id="phone"
              {...register("basic.phone")}
              placeholder="+7 (999) 999-99-99"
            />
          </InputGroup>
          {errors.basic?.phone && (
            <p className="text-sm text-red-500">{errors.basic.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="password" className="mb-2 text-gray-700">
            Пароль
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Lock />
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("basic.password")}
              placeholder="Введите пароль"
            />
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </InputGroupAddon>
          </InputGroup>
          {errors.basic?.password && (
            <p className="text-sm text-red-500">{errors.basic.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="mb-2 text-gray-700">
            Подтвердите пароль
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Lock />
            </InputGroupAddon>
            <InputGroupInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("basic.confirmPassword")}
              placeholder="Введите пароль"
            />
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setShowConfirmPassword((s) => !s)}
            >
              {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </InputGroupAddon>
          </InputGroup>
          {errors.basic?.confirmPassword && (
            <p className="text-sm text-red-500">{errors.basic.confirmPassword.message as string}</p>
          )}
        </div>
      </div>
    </>
  )
}
