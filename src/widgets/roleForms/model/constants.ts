export const clinicFields = [
  {
    name: "legalName",
    label: "Юридическое название",
    placeholder: "ООО 'Медицинская клиника'",
    id: "legalName",
  },
  {
    name: "clinicInn",
    label: "ИНН",
    placeholder: "7701234567",
    id: "clinicInn",
  },
  {
    name: "ogrn",
    label: "ОГРН",
    placeholder: "1234567890123",
    id: "ogrn",
  },
  {
    name: "legalAddress",
    label: "Юридический адрес",
    placeholder: "г. Москва, ул. Ленина, д. 1",
    id: "legalAddress",
  },
  {
    name: "actualAddress",
    label: "Фактический адрес",
    placeholder: "г. Москва, ул. Ленина, д. 1",
    id: "actualAddress",
  },
  {
    name: "clinicLicense",
    label: "Номер лицензии",
    placeholder: "ЛО-77-01-123456",
    id: "clinicLicense",
  },
  {
    name: "directorName",
    label: "ФИО директора",
    placeholder: "Иванов Иван Иванович",
    id: "directorName",
  },
  {
    name: "directorPosition",
    label: "Должность директора",
    placeholder: "Генеральный директор",
    id: "directorPosition",
  },
]

export const doctorFields = [
  {
    name: "licenseNumber",
    label: "Номер лицензии",
    placeholder: "ЛО-77-01-123456",
    id: "licenseNumber",
    type: "text" as const,
  },
  {
    name: "specialization",
    label: "Специализация",
    placeholder: "Пластическая хирургия",
    id: "specialization",
    type: "text" as const,
  },
  {
    name: "experience",
    label: "Опыт работы (лет)",
    placeholder: "10",
    id: "experience",
    type: "number" as const,
  },
  {
    name: "education",
    label: "Образование",
    placeholder: "РНИМУ им. Н.И. Пирогова",
    id: "education",
    type: "text" as const,
  },
  {
    name: "workplace",
    label: "Место работы",
    placeholder: "Клиника пластической хирургии",
    id: "workplace",
    type: "text" as const,
    optional: true,
  },
  {
    name: "inn",
    label: "ИНН",
    placeholder: "123456789012",
    id: "inn",
    type: "text" as const,
  },
  {
    name: "birthDate",
    label: "Дата рождения",
    id: "birthDate",
    type: "date" as const,
    optional: true,
  },
  {
    name: "gender",
    label: "Пол",
    id: "gender",
    type: "select" as const,
    options: [
      { value: "male", label: "Мужской" },
      { value: "female", label: "Женский" },
    ],
    optional: true,
  },
]

export const patientFields = [
  {
    name: "birthDate",
    label: "Дата рождения",
    id: "birthDate",
    type: "date" as const,
    optional: true,
  },
  {
    name: "gender",
    label: "Пол",
    id: "gender",
    type: "select" as const,
    options: [
      { value: "male", label: "Мужской" },
      { value: "female", label: "Женский" },
    ],
    optional: true,
  },
]
