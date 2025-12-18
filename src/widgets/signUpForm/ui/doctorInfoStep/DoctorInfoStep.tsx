import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/inputGroup";
import { Label } from "@/shared/ui/label";
import { FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { SignUpFormData } from "@/features/signUp/model/types";

export function DoctorInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignUpFormData>();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="licenseNumber" className="text-gray-700 mb-2">
            Номер лицензии
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              {...register("doctor.licenseNumber")}
              placeholder="ЛО-77-01-123456"
            />
          </InputGroup>
          {errors.doctor?.licenseNumber && (
            <p className="text-sm text-red-500">
              {errors.doctor.licenseNumber.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="specialization" className="text-gray-700 mb-2">
            Специализация
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              {...register("doctor.specialization")}
              placeholder="Пластическая хирургия"
            />
          </InputGroup>
          {errors.doctor?.specialization && (
            <p className="text-sm text-red-500">
              {errors.doctor.specialization.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="experience" className="text-gray-700 mb-2">
            Опыт работы
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              type="number"
              {...register("doctor.experience", {
                valueAsNumber: true,
              })}
              placeholder="10"
            />
          </InputGroup>
          {errors.doctor?.experience && (
            <p className="text-sm text-red-500">{errors.doctor.experience.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="inn" className="text-gray-700 mb-2">
            ИНН
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput {...register("doctor.inn")} placeholder="1234567890" />
          </InputGroup>
          {errors.doctor?.inn && (
            <p className="text-sm text-red-500">{errors.doctor.inn.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="education" className="text-gray-700 mb-2">
          Образование
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            {...register("doctor.education")}
            placeholder="РНИМУ им. Н.И. Пирогова"
          />
        </InputGroup>
        {errors.doctor?.education && (
          <p className="text-sm text-red-500">{errors.doctor.education.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="workplace" className="text-gray-700 mb-2">
          Место работы
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            {...register("doctor.workplace")}
            placeholder="Клиника пластической хирургии"
          />
        </InputGroup>
        {errors.doctor?.workplace && (
          <p className="text-sm text-red-500">{errors.doctor.workplace.message}</p>
        )}
      </div>
    </>
  );
}
