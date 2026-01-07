import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Label } from "@/shared/ui/label"
import { FileText } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { SignUpFormData } from "@/features/signUp/model/types"

export function DoctorInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignUpFormData>()

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="licenseNumber" className="mb-2 text-gray-700">
            Номер лицензии
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              id="licenseNumber"
              {...register("doctor.licenseNumber")}
              placeholder="ЛО-77-01-123456"
            />
          </InputGroup>
          {errors.doctor?.licenseNumber && (
            <p className="text-sm text-red-500">{errors.doctor.licenseNumber.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="specialization" className="mb-2 text-gray-700">
            Специализация
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              id="specialization"
              {...register("doctor.specialization")}
              placeholder="Пластическая хирургия"
            />
          </InputGroup>
          {errors.doctor?.specialization && (
            <p className="text-sm text-red-500">{errors.doctor.specialization.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="experience" className="mb-2 text-gray-700">
            Опыт работы
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              id="experience"
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
          <Label htmlFor="inn" className="mb-2 text-gray-700">
            ИНН
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput id="inn" {...register("doctor.inn")} placeholder="1234567890" />
          </InputGroup>
          {errors.doctor?.inn && (
            <p className="text-sm text-red-500">{errors.doctor.inn.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="education" className="mb-2 text-gray-700">
          Образование
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            id="education"
            {...register("doctor.education")}
            placeholder="РНИМУ им. Н.И. Пирогова"
          />
        </InputGroup>
        {errors.doctor?.education && (
          <p className="text-sm text-red-500">{errors.doctor.education.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="workplace" className="mb-2 text-gray-700">
          Место работы
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            id="workplace"
            {...register("doctor.workplace")}
            placeholder="Клиника пластической хирургии"
          />
        </InputGroup>
        {errors.doctor?.workplace && (
          <p className="text-sm text-red-500">{errors.doctor.workplace.message}</p>
        )}
      </div>
    </>
  )
}
