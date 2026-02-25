import { Mail, Eye, EyeOff, ArrowLeft, User, Phone, Lock } from "lucide-react"
import { useSignUpForm } from "@/features/auth/ui/signUp/hooks/useSignUpForm"
import { RoleSelector } from "@/widgets/roleSelector/ui/RoleSelector"
import { ConsentSection } from "@/features/consent/ui/ConsentSection"
import { Button } from "@/shared/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { USER_ROLE } from "@/entities/user/model/user.constants"
import { ROUTES } from "@/shared/model/routes"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { useNavigate } from "react-router"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { formatPhoneNumber } from "@/shared/lib/utils"

export function SignUpForm() {
  const {
    form,
    role,
    currentStep,
    setCurrentStep,
    hasConsent,
    isLoading,
    acceptConsent,
    onSubmit,
    FormProvider,
  } = useSignUpForm()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  if (currentStep === 2) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="size-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Проверьте почту</CardTitle>
            <CardDescription>
              Мы отправили письмо для подтверждения на <strong>{form.getValues("email")}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Пожалуйста, перейдите по ссылке в письме, чтобы активировать ваш аккаунт и завершить регистрацию.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="https://mail.google.com" target="_blank">Перейти к письмам</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        className="flex min-h-screen items-center justify-center"
      >
        <Card className="max-md:h-full max-md:w-full max-md:border-0">
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              {currentStep === 0 ? "Выберите тип аккаунта" : "Создайте новый аккаунт"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-child">
            {currentStep == 0 && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <RoleSelector
                      onRoleSelect={(role) => (field.onChange(role), setCurrentStep((s) => s + 1))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentStep == 1 && (
              <>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {role === USER_ROLE.CLINIC ? "Название клиники" : "Фамилия Имя Отчество"}
                      </FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <User />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="fullName"
                            placeholder={
                              role === USER_ROLE.CLINIC
                                ? "Клиника 'Эстетика'"
                                : "Иванов Иван Иванович"
                            }
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Mail />
                            </InputGroupAddon>
                            <InputGroupInput id="email" placeholder="example@mail.ru" {...field} />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Phone />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="phone"
                              {...field}
                              value={formatPhoneNumber(field.value || "")}
                              placeholder="+7 (999) 999-99-99"
                            />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Lock />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Введите пароль"
                              {...field}
                            />
                            <InputGroupAddon
                              align="inline-end"
                              className="cursor-pointer"
                              onClick={() => setShowPassword((s) => !s)}
                            >
                              {showPassword ? (
                                <Eye className="h-5 w-5" />
                              ) : (
                                <EyeOff className="h-5 w-5" />
                              )}
                            </InputGroupAddon>
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подтвердите пароль</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Lock />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="rePassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Введите пароль"
                              {...field}
                            />
                            <InputGroupAddon
                              align="inline-end"
                              className="cursor-pointer"
                              onClick={() => setShowConfirmPassword((s) => !s)}
                            >
                              {showConfirmPassword ? (
                                <Eye className="h-5 w-5" />
                              ) : (
                                <EyeOff className="h-5 w-5" />
                              )}
                            </InputGroupAddon>
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="space-child grid">
            {currentStep === 1 && (
              <>
                <ConsentSection
                  hasConsent={hasConsent}
                  onAccept={acceptConsent}
                />
                <Button
                  disabled={isLoading}
                  variant="secondary"
                  size={isMobile ? "lg" : "md"}
                  onClick={() => setCurrentStep((s) => s - 1)}
                >
                  <ArrowLeft />
                  Выбрать роль
                </Button>
                <Button type="submit" size={isMobile ? "lg" : "md"} disabled={isLoading}>
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </>
            )}
            {currentStep === 0 && (
              <Button
                className="w-full"
                size={isMobile ? "lg" : "md"}
                onClick={() => navigate(ROUTES.SIGNIN)}
                variant="secondary"
              >
                Войти
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
