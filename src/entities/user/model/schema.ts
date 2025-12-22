import z from "zod"

export const genderSchema = z.enum(["male", "female"])

export const basicInfoSchema = z
  .object({
    fullName: z.string().min(2, "Введите ФИО"),
    email: z.email("Неверный формат email"),
    phone: z.string().min(10, "Неверный номер телефона"),
    password: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export const patientInfoSchema = z.object({
  birthDate: z.string().optional(),
  gender: genderSchema.optional(),
})

export const doctorInfoSchema = z.object({
  licenseNumber: z.string().min(3, "Номер лицензии обязателен"),
  specialization: z.string().min(2, "Укажите специализацию"),
  experience: z.number().min(0, "Опыт не может быть отрицательным").max(60),
  education: z.string().min(2, "Укажите образование"),
  workplace: z.string().min(2, "Укажите место работы"),
  inn: z.string().length(10, "ИНН должен быть 10 цифр"),
  birthDate: z.string().optional(),
  gender: genderSchema.optional(),
})

export const clinicInfoSchema = z.object({
  legalName: z.string().min(2),
  clinicInn: z.string().length(10, "ИНН клиники — 10 цифр"),
  ogrn: z.string().length(13, "ОГРН — 13 цифр"),
  legalAddress: z.string().min(5),
  actualAddress: z.string().min(5),
  clinicLicense: z.string().min(5),
  directorName: z.string().min(2),
  directorPosition: z.string().min(2),
})
