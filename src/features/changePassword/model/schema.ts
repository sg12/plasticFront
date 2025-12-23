import z from "zod"

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string().min(1, "Подтвердите новый пароль"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
