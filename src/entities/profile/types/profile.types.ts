import type { ClinicDto, DoctorDto, PatientDto } from "@/entities/user/model/user.schema"
import type { UseFormReturn } from "react-hook-form"

export type Mode = "edit" | "view"

export interface FormInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
  mode?: Mode
  isSaving?: boolean
}

export type ProfileResponse = PatientDto | DoctorDto | ClinicDto
