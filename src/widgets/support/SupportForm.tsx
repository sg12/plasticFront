import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/shared/ui/inputGroup"
import { Loader, Send } from "lucide-react"
import { useIsMobile } from "@/shared/hooks/useMobile"
import { useSupport } from "@/features/support/hooks/useSupport"

export const SupportForm = () => {
  const {
    form,
    FormProvider,
    onSubmit,
    isCreating,
  } = useSupport()

  const isMobile = useIsMobile()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Написать в поддержку</CardTitle>
        <CardDescription>Опишите вашу проблему, и мы обязательно поможем</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={form.control}
              disabled={isCreating}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема обращения</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        id="subject"
                        placeholder="Например: Проблема с регистрацией"
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
              disabled={isCreating}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сообщение</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupTextarea
                        id="message"
                        placeholder="Опишите вашу проблему подробно..."
                        rows={5}
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isCreating} className="w-full" size={isMobile ? "lg" : "md"}>
              {isCreating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Отправить обращение
                </>
              )}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
