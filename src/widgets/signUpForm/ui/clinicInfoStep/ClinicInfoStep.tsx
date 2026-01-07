import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Label } from "@/shared/ui/label"
import { FileText } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { SignUpFormData } from "@/features/signUp/model/types"

export function ClinicInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignUpFormData>()

  const clinicErrors = "clinic" in errors ? errors.clinic : undefined

  return (
    <>
      <div>
        <Label htmlFor="legalName" className="mb-2 text-gray-700">
          Юридическое название
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            id="legalName"
            {...register("clinic.legalName")}
            placeholder="ООО 'Медицинская клиника'"
          />
        </InputGroup>
        {clinicErrors?.legalName && (
          <p className="text-sm text-red-500">{clinicErrors.legalName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="clinicInn" className="mb-2 text-gray-700">
            ИНН клиники
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              id="clinicInn"
              {...register("clinic.clinicInn")}
              placeholder="7701234567"
            />
          </InputGroup>
          {clinicErrors?.clinicInn && (
            <p className="text-sm text-red-500">{clinicErrors.clinicInn.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="ogrn" className="mb-2 text-gray-700">
            ОГРН
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput id="ogrn" {...register("clinic.ogrn")} placeholder="1234567890123" />
          </InputGroup>
          {clinicErrors?.ogrn && (
            <p className="text-sm text-red-500">{clinicErrors.ogrn.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="legalAddress" className="mb-2 text-gray-700">
          Юридический адрес
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            id="legalAddress"
            {...register("clinic.legalAddress")}
            placeholder="г. Москва, ул. Ленина, д. 1"
          />
        </InputGroup>
        {clinicErrors?.legalAddress && (
          <p className="text-sm text-red-500">{clinicErrors.legalAddress.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="actualAddress" className="mb-2 text-gray-700">
          Фактический адрес
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            id="actualAddress"
            {...register("clinic.actualAddress")}
            placeholder="г. Москва, ул. Ленина, д. 1"
          />
        </InputGroup>
        {clinicErrors?.actualAddress && (
          <p className="text-sm text-red-500">{clinicErrors.actualAddress.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="clinicLicense" className="mb-2 text-gray-700">
          Номер медицинской лицензии
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            id="clinicLicense"
            {...register("clinic.clinicLicense")}
            placeholder="ЛО-77-01-123456"
          />
        </InputGroup>
        {clinicErrors?.clinicLicense && (
          <p className="text-sm text-red-500">{clinicErrors.clinicLicense.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="directorName" className="mb-2 text-gray-700">
            ФИО руководителя
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              id="directorName"
              {...register("clinic.directorName")}
              placeholder="Иванов Иван Иванович"
            />
          </InputGroup>
          {clinicErrors?.directorName && (
            <p className="text-sm text-red-500">{clinicErrors.directorName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="directorPosition" className="mb-2 text-gray-700">
            Должность руководителя
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              id="directorPosition"
              {...register("clinic.directorPosition")}
              placeholder="Генеральный директор"
            />
          </InputGroup>
          {clinicErrors?.directorPosition && (
            <p className="text-sm text-red-500">{clinicErrors.directorPosition.message}</p>
          )}
        </div>
      </div>
    </>
  )
}
