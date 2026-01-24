import { Mail, Eye, EyeOff, ArrowLeft, User, Phone, Lock } from "lucide-react"
import { useSignUpForm } from "@/features/auth/ui/signUp/hooks/useSignUpForm"
import { RoleSelector } from "@/widgets/roleSelector/ui/RoleSelector"
import { ConsentSection } from "@/features/consent/ui/ConsentSection"
import { Button } from "@/shared/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { USER_ROLES } from "@/entities/user/model/constants"
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
    loading,
    acceptConsent,
    openPrivacyModal,
    onSubmit,
    FormProvider,
  } = useSignUpForm()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // if (isRegistrationRequestSent) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="w-full max-w-md">
  //         <div className="space-global rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
  //           <Mail className="mx-auto h-12 w-12 text-green-500" />
  //           <h2 className="text-2xl font-bold text-gray-900">Подтвердите ваш email</h2>
  //           <p className="text-gray-600">
  //             Мы отправили вам письмо для подтверждения. Пожалуйста, проверьте свою почту и следуйте
  //             инструкциям для завершения регистрации.
  //           </p>
  //           <Button asChild>
  //             <a href={`mailto:${form.getValues("basic.email")}`}>Открыть почтовый клиент</a>
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
                  name="basic.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {role === USER_ROLES.CLINIC ? "Название клиники" : "Фамилия Имя Отчество"}
                      </FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <User />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="fullName"
                            placeholder={
                              role === USER_ROLES.CLINIC
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
                    name="basic.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Mail />
                            </InputGroupAddon>
                            <InputGroupInput id="email" placeholder="example@mail.ru" {...field} className="capitalize" />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="basic.phone"
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
                              value={formatPhoneNumber(field.value)}
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
                    name="basic.password"
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
                    name="basic.confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подтвердите пароль</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <Lock />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="confirmPassword"
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
                  userRole={role}
                  onAccept={acceptConsent}
                  onShowPrivacyModal={openPrivacyModal}
                />
                <Button
                  disabled={loading}
                  variant="secondary"
                  size={isMobile ? "lg" : "md"}
                  onClick={() => setCurrentStep((s) => s - 1)}
                >
                  <ArrowLeft />
                  Выбрать роль
                </Button>
                <Button type="submit" size={isMobile ? "lg" : "md"} disabled={loading}>
                  {loading ? "Регистрация..." : "Зарегистрироваться"}
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
