import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/inputGroup";
import { Label } from "@/shared/ui/label";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { SignUpFormData } from "@/features/signUp/model/types";

export function BasicInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignUpFormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div>

        <Label htmlFor="fullName" className="text-gray-700 mb-2">
          Фамилия Имя Отчество
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupInput
            {...register("basic.fullName")}
            placeholder="Иванов Иван Иванович"
          />
        </InputGroup>
        {errors.basic?.fullName && (
          <p className="text-sm text-red-500">{errors.basic.fullName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="email" className="text-gray-700 mb-2">
            Email
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Mail />
            </InputGroupAddon>
            <InputGroupInput
              {...register("basic.email")}
              placeholder="example@mail.ru"
            />
          </InputGroup>
          {errors.basic?.email && (
            <p className="text-sm text-red-500">{errors.basic.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-gray-700 mb-2">
            Телефон
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Phone />
            </InputGroupAddon>
            <InputGroupInput
              {...register("basic.phone")}
              placeholder="+7 (999) 999-99-99"
            />
          </InputGroup>
          {errors.basic?.phone && (
            <p className="text-sm text-red-500">{errors.basic.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="password" className="text-gray-700 mb-2">
            Пароль
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Lock />
            </InputGroupAddon>
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              {...register("basic.password")}
              placeholder="Введите пароль"
            />
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </InputGroupAddon>
          </InputGroup>
          {errors.basic?.password && (
            <p className="text-sm text-red-500">{errors.basic.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-gray-700 mb-2">
            Подтвердите пароль
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Lock />
            </InputGroupAddon>
            <InputGroupInput
              type={showConfirmPassword ? "text" : "password"}
              {...register("basic.confirmPassword")}
              placeholder="Введите пароль"
            />
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setShowConfirmPassword((s) => !s)}
            >
              {showConfirmPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </InputGroupAddon>
          </InputGroup>
          {errors.basic?.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.basic.confirmPassword.message as string}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
