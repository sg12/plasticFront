import { GENDER_LOCALES, USER_GENDER } from "@/entities/user/model/user.constants"

export const clinicFields = [
  {
    name: "clinic.legalName",
    label: "Юридическое название",
    placeholder: "ООО 'Медицинская клиника'",
    id: "legalName",
  },
  {
    name: "clinic.clinicInn",
    label: "ИНН",
    placeholder: "7701234567",
    id: "clinicInn",
  },
  {
    name: "clinic.ogrn",
    label: "ОГРН",
    placeholder: "1234567890123",
    id: "ogrn",
  },
  {
    name: "clinic.legalAddress",
    label: "Юридический адрес",
    placeholder: "г. Москва, ул. Ленина, д. 1",
    id: "legalAddress",
  },
  {
    name: "clinic.actualAddress",
    label: "Фактический адрес",
    placeholder: "г. Москва, ул. Ленина, д. 1",
    id: "actualAddress",
  },
  {
    name: "clinic.clinicLicense",
    label: "Номер лицензии",
    placeholder: "ЛО-77-01-123456",
    id: "clinicLicense",
  },
  {
    name: "clinic.directorName",
    label: "ФИО директора",
    placeholder: "Иванов Иван Иванович",
    id: "directorName",
  },
  {
    name: "clinic.directorPosition",
    label: "Должность директора",
    placeholder: "Генеральный директор",
    id: "directorPosition",
  },
]

export const doctorFields = [
  {
    name: "doctor.licenseNumber",
    label: "Номер лицензии",
    placeholder: "ЛО-77-01-123456",
    id: "licenseNumber",
    type: "text" as const,
  },
  {
    name: "doctor.specialization",
    label: "Специализация",
    placeholder: "Пластическая хирургия",
    id: "specialization",
    type: "text" as const,
  },
  {
    name: "doctor.experience",
    label: "Опыт работы (лет)",
    placeholder: "10",
    id: "experience",
    type: "number" as const,
  },
  {
    name: "doctor.education",
    label: "Образование",
    placeholder: "РНИМУ им. Н.И. Пирогова",
    id: "education",
    type: "text" as const,
  },
  {
    name: "doctor.workplace",
    label: "Место работы",
    placeholder: "Частная практика или доп. информация",
    id: "workplace",
    type: "text" as const,
    optional: true,
  },
  {
    name: "doctor.inn",
    label: "ИНН",
    placeholder: "123456789012",
    id: "inn",
    type: "text" as const,
  },
  {
    name: "doctor.birthdate",
    label: "Дата рождения",
    id: "birthdate",
    type: "date" as const,
    optional: true,
  },
  {
    name: "doctor.gender",
    label: "Пол",
    id: "gender",
    type: "select" as const,
    options: [
      { value: USER_GENDER.MALE, label: GENDER_LOCALES["MALE"].ru },
      { value: USER_GENDER.FEMALE, label: GENDER_LOCALES["FEMALE"].ru },
    ],
    optional: true,
  },
]

export const patientFields = [
  {
    name: "patient.birthdate",
    label: "Дата рождения",
    id: "birthdate",
    type: "date" as const,
    optional: true,
  },
  {
    name: "patient.gender",
    label: "Пол",
    id: "gender",
    type: "select" as const,
    options: [
      { value: USER_GENDER.MALE, label: GENDER_LOCALES["MALE"].ru },
      { value: USER_GENDER.FEMALE, label: GENDER_LOCALES["FEMALE"].ru },
    ],
    optional: true,
  },
]
