import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router"
import { FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { FormProvider } from "react-hook-form"
import { useSignInForm } from "@/features/auth/ui/signIn/hooks/useSignInForm"
import { Button } from "@/shared/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { ROUTES } from "@/shared/model/routes"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { useIsMobile } from "@/shared/hooks/useMobile"

export function SignInForm() {
  const { form, showPassword, isLoading, setShowPassword, onSubmit } = useSignInForm()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        className="flex min-h-screen items-center justify-center"
      >
        <Card className="max-md:h-full max-md:w-full max-md:border-0">
          <CardHeader>
            <CardTitle>Вход</CardTitle>
          </CardHeader>

          <CardContent className="space-child">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@mail.com"
                      required
                      disabled={isLoading}
                    />
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Пароль</FormLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Lock />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Пароль"
                      required
                      disabled={isLoading}
                    />
                    <InputGroupAddon>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <CardAction className="space-child w-full">
              <Button
                type="submit"
                className="w-full"
                size={isMobile ? "lg" : "md"}
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
              <Button
                className="w-full"
                size={isMobile ? "lg" : "md"}
                onClick={() => navigate(ROUTES.SIGNUP)}
                variant="secondary"
                disabled={isLoading}
              >
                Зарегистрироваться
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
