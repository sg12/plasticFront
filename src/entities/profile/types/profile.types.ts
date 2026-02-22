import type { ClinicDto, DoctorDto, PatientDto } from "@/entities/user/model/user.schema"

export type ProfileResponse = PatientDto | DoctorDto | ClinicDto
