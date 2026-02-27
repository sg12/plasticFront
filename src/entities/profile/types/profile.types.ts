import type { ClinicDto, DoctorDto, PatientDto } from "@/entities/user/model/user.schema"
import type { FieldValues, UseFormReturn } from "react-hook-form"

export type Mode = "edit" | "view"

export interface ProfileProps {
  form: UseFormReturn<FieldValues>
  mode?: Mode
  isSaving?: boolean
}

export type ProfileResponse = PatientDto | DoctorDto | ClinicDto
