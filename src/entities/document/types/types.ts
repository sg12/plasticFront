export type PatientUploadedFiles = {}

export type DoctorUploadedFiles = {
  diploma?: File
  license?: File
  certificate?: File
}

export type ClinicUploadedFiles = {
  clinicDocuments?: File[]
}

export type UploadedFilesByRole = {
  patient?: PatientUploadedFiles
  doctor?: DoctorUploadedFiles
  clinic?: ClinicUploadedFiles
}
