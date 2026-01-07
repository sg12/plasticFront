import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { NavLink } from "react-router"
import { FormControl, FormField, FormItem, FormMessage } from "@/shared/ui/form"
import { FormProvider } from "react-hook-form"
import { useSignInForm } from "@/features/auth/ui/signIn/hooks/useSignInForm"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Label } from "@/shared/ui/label"

export function SignInForm() {
  const { form, showPassword, isLoading, setShowPassword, onSubmit } = useSignInForm()

  return (
    <FormProvider {...form}>
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-6"
        >
          <div className="w-full space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
            <h2>Вход</h2>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email" className="mb-2 text-gray-700">
                    Email
                  </Label>
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
                  <Label htmlFor="password" className="mb-2 text-gray-700">
                    Пароль
                  </Label>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>

            <Separator className="relative inset-0 flex items-center justify-center">
              <span className="bg-white px-4 text-gray-500">или</span>
            </Separator>

            <div className="text-center">
              <p className="text-gray-600">
                Нет аккаунта?{" "}
                <NavLink to="/signup" className="text-purple-600 hover:text-purple-700">
                  Зарегистрироваться
                </NavLink>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 Агрегатор пластических услуг</p>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
