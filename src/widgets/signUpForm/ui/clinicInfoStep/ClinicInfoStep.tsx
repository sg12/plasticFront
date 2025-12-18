import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/inputGroup";
import { Label } from "@/shared/ui/label";
import { FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { SignUpFormData } from "@/features/signUp/model/types";

export function ClinicInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignUpFormData>();

  const clinicErrors = "clinic" in errors ? errors.clinic : undefined;

  return (
    <>
      <div>
        <Label htmlFor="legalName" className="text-gray-700 mb-2">
          Юридическое название
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            {...register("clinic.legalName")}
            placeholder="ООО 'Медицинская клиника'"
          />
        </InputGroup>
        {clinicErrors?.legalName && (
          <p className="text-sm text-red-500">{clinicErrors.legalName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="clinicInn" className="text-gray-700 mb-2">
            ИНН клиники
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              {...register("clinic.clinicInn")}
              placeholder="7701234567"
            />
          </InputGroup>
          {clinicErrors?.clinicInn && (
            <p className="text-sm text-red-500">{clinicErrors.clinicInn.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="ogrn" className="text-gray-700 mb-2">
            ОГРН
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              {...register("clinic.ogrn")}
              placeholder="1234567890123"
            />
          </InputGroup>
          {clinicErrors?.ogrn && (
            <p className="text-sm text-red-500">{clinicErrors.ogrn.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="legalAddress" className="text-gray-700 mb-2">
          Юридический адрес
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            {...register("clinic.legalAddress")}
            placeholder="г. Москва, ул. Ленина, д. 1"
          />
        </InputGroup>
        {clinicErrors?.legalAddress && (
          <p className="text-sm text-red-500">{clinicErrors.legalAddress.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="actualAddress" className="text-gray-700 mb-2">
          Фактический адрес
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            {...register("clinic.actualAddress")}
            placeholder="г. Москва, ул. Ленина, д. 1"
          />
        </InputGroup>
        {clinicErrors?.actualAddress && (
          <p className="text-sm text-red-500">{clinicErrors.actualAddress.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="clinicLicense" className="text-gray-700 mb-2">
          Номер медицинской лицензии
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <FileText />
          </InputGroupAddon>
          <InputGroupInput
            {...register("clinic.clinicLicense")}
            placeholder="ЛО-77-01-123456"
          />
        </InputGroup>
        {clinicErrors?.clinicLicense && (
          <p className="text-sm text-red-500">{clinicErrors.clinicLicense.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="directorName" className="text-gray-700 mb-2">
            ФИО руководителя
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
              {...register("clinic.directorName")}
              placeholder="Иванов Иван Иванович"
            />
          </InputGroup>
          {clinicErrors?.directorName && (
            <p className="text-sm text-red-500">{clinicErrors.directorName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="directorPosition" className="text-gray-700 mb-2">
            Должность руководителя
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <FileText />
            </InputGroupAddon>
            <InputGroupInput
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
  );
}
