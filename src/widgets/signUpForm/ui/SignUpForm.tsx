import { Mail, Eye, EyeOff, ArrowLeft, User, Phone, Lock } from "lucide-react"
import { useSignUpForm } from "@/features/auth/ui/signUp/hooks/useSignUpForm"
import { ConsentModal } from "@/widgets/consentModal/ui/ConsentModal"
import { PrivacyModal } from "@/widgets/privacyModal/ui/PrivacyModal"
import { RoleSelector } from "@/widgets/roleSelector/ui/RoleSelector"
import { ConsentSection } from "@/widgets/consentSection/ui/ConsentSection"
import { NavLink } from "react-router"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"

export function SignUpForm() {
  const {
    form,
    role,
    showConsentModal,
    showPrivacyModal,
    currentStep,
    setCurrentStep,
    hasConsent,
    loading,
    openConsentModal,
    closeConsentModal,
    openPrivacyModal,
    closePrivacyModal,
    acceptConsent,
    onSubmit,
    FormProvider
  } = useSignUpForm()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // if (isRegistrationRequestSent) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="w-full max-w-md">
  //         <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
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
      <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="w-full max-w-2xl">
            <div className="w-full space-y-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="mb-2 text-gray-900">Регистрация</h2>
                <p className="text-gray-600">
                  {currentStep === 0 ? "Выберите тип аккаунта" : "Создайте новый аккаунт"}
                </p>
              </div>

              {showConsentModal && (
                <ConsentModal
                  userRole={role}
                  onAccept={acceptConsent}
                  onDecline={closeConsentModal}
                  onShowPrivacyModal={openPrivacyModal}
                />
              )}

              {showPrivacyModal && <PrivacyModal onClose={closePrivacyModal} />}

              {currentStep == 0 && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <RoleSelector
                        onRoleSelect={(role) => (
                          field.onChange(role),
                          setCurrentStep((s) => s + 1)
                        )}
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
                        <FormLabel>Фамилия Имя Отчество</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <User />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="fullName"
                              placeholder="Иванов Иван Иванович"
                              {...field}
                            />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
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
                              <InputGroupInput
                                id="email"
                                placeholder="example@mail.ru"
                                {...field}
                              />
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
                                placeholder="+7 (999) 999-99-99"
                                {...field}
                              />
                            </InputGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
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

                  <ConsentSection
                    hasConsent={hasConsent}
                    onShowConsentModal={openConsentModal}
                    userRole={role}
                  />

                  <div className="grid grid-cols-2 gap-5">
                    <Button
                      disabled={loading}
                      variant="secondary"
                      onClick={() => setCurrentStep((s) => s - 1)}
                    >
                      <ArrowLeft />
                      Выбрать роль
                    </Button>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
                  </div>
                </>
              )}

              <Separator className="relative inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-gray-500">или</span>
              </Separator>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Уже есть аккаунт?{" "}
                  <NavLink to="/signin" className="text-purple-600 hover:text-purple-700">
                    Войти
                  </NavLink>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>© 2025 Агрегатор пластических услуг</p>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
