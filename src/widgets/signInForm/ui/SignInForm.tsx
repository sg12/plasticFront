import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { FormProvider } from "react-hook-form";
import { useSignInForm } from "@/features/signIn/hooks/useSignInForm";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/inputGroup";
import { Label } from "@/shared/ui/label";

export function SignInForm() {
  const { form, showPassword, isLoading, setShowPassword, onSubmit } =
    useSignInForm();

  const navigate = useNavigate();

  return (
    <FormProvider {...form}>
      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6"
        >
          <h2>Вход</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email" className="text-gray-700 mb-2">
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
                <FormControl>
                  <div className="relative">
                    <Label htmlFor="password" className="text-gray-700 mb-2">
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            Войти
          </Button>

          <Separator className="relative inset-0 flex items-center justify-center">
            <span className="px-4 bg-white text-gray-500">или</span>
          </Separator>

          <div className="text-center">
            <p className="text-gray-600">
              Нет аккаунта?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-600 hover:text-purple-700"
              >
                Зарегистрироваться
              </button>
            </p>
          </div>
        </form>
      </div>
    </FormProvider>
    // <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center p-4">
    //   <div className="w-full max-w-md">
    //     <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
    //       <form onSubmit={handleSubmit} className="space-y-6">
    //         <div>
    //           <label
    //             htmlFor="email"
    //             className="block text-sm text-gray-700 mb-2"
    //           >
    //             Email
    //           </label>
    //           <div className="relative">
    //             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    //             <input
    //               type="email"
    //               id="email"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               placeholder="example@mail.com"
    //               required
    //               className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    //             />
    //           </div>
    //         </div>

    //         <div>
    //           <label
    //             htmlFor="password"
    //             className="block text-sm text-gray-700 mb-2"
    //           >
    //             Пароль
    //           </label>
    //           <div className="relative">
    //             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    //             <input
    //               type={showPassword ? "text" : "password"}
    //               id="password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //               placeholder="••••••••"
    //               required
    //               className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    //             />
    //             <button
    //               type="button"
    //               onClick={() => setShowPassword(!showPassword)}
    //               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    //             >
    //               {showPassword ? (
    //                 <EyeOff className="w-5 h-5" />
    //               ) : (
    //                 <Eye className="w-5 h-5" />
    //               )}
    //             </button>
    //           </div>
    //         </div>

    //         <div className="flex items-center justify-between">
    //           <label className="flex items-center">
    //             <input
    //               type="checkbox"
    //               className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
    //             />
    //             <span className="ml-2 text-sm text-gray-600">
    //               Запомнить меня
    //             </span>
    //           </label>
    //           <button
    //             type="button"
    //             className="text-sm text-purple-600 hover:text-purple-700"
    //             onClick={onShowForgotPassword}
    //           >
    //             Забыли пароль?
    //           </button>
    //         </div>

    //         <button
    //           type="submit"
    //           disabled={isLoading}
    //           className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    //         >
    //           {isLoading ? (
    //             <div className="flex items-center justify-center gap-2">
    //               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    //               <span>Вход...</span>
    //             </div>
    //           ) : (
    //             "Войти"
    //           )}
    //         </button>
    //       </form>

    //       <div className="relative my-6">
    //         <div className="absolute inset-0 flex items-center">
    //           <div className="w-full border-t border-gray-300"></div>
    //         </div>
    //         <div className="relative flex justify-center text-sm">
    //           <span className="px-4 bg-white text-gray-500">или</span>
    //         </div>
    //       </div>

    //       <div className="text-center">
    //         <p className="text-sm text-gray-600">
    //           Нет аккаунта?{" "}
    //           <button
    //             className="text-purple-600 hover:text-purple-700"
    //             onClick={onShowSignUp}
    //           >
    //             Зарегистрироваться
    //           </button>
    //         </p>
    //       </div>
    //     </div>

    //     <div className="mt-8 text-center text-sm text-gray-500">
    //       <p>© 2025 Агрегатор пластических услуг</p>
    //     </div>
    //   </div>
    // </div>
  );
}
