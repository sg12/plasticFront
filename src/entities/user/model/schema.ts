import z from "zod"

export const genderSchema = z.enum(["male", "female"])

export const birthDateSchema = z.date("Дата рождения обязательна").refine(
  (date) => {
    const today = new Date()
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    return date <= eighteenYearsAgo
  },
  {
    message: "Вам должно быть не менее 18 лет",
  },
)

const documentsSchema = z.record(z.string(), z.union([z.string(), z.array(z.string())])).nullable()

export const basicInfoSchema = z.object({
  fullName: z.string().min(2, "Введите ФИО"),
  email: z.email("Неверный формат email"),
  phone: z.string().min(10, "Неверный номер телефона"),
  password: z.string().min(6, "Минимум 6 символов").optional(),
  confirmPassword: z.string().optional(),
})

export const patientInfoSchema = z.object({
  birthDate: birthDateSchema.optional(),
  gender: genderSchema.optional(),
})

export const doctorInfoSchema = z.object({
  licenseNumber: z.string().min(3, "Номер лицензии обязателен"),
  specialization: z.string().min(2, "Укажите специализацию"),
  experience: z.number().min(0, "Опыт не может быть отрицательным").max(60),
  education: z.string().min(2, "Укажите образование"),
  workplace: z.string().min(2, "Укажите место работы").or(z.literal("")).optional(),
  inn: z.string().length(10, "ИНН должен быть 10 цифр"),
  birthDate: birthDateSchema.optional(),
  gender: genderSchema.optional(),
  documents: documentsSchema,
})

export const clinicInfoSchema = z.object({
  legalName: z.string().min(2, "Введите юридическое название"),
  clinicInn: z.string().length(10, "ИНН клиники должен содержать 10 цифр"),
  ogrn: z.string().length(13, "ОГРН должен содержать 13 цифр"),
  legalAddress: z.string().min(5, "Укажите юридический адрес"),
  actualAddress: z.string().min(5, "Укажите фактический адрес"),
  clinicLicense: z.string().min(5, "Номер лицензии слишком короткий"),
  directorName: z.string().min(2, "Введите ФИО директора"),
  directorPosition: z.string().min(2, "Укажите должность директора"),
  documents: documentsSchema,
})
