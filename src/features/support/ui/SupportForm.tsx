import type { SupportFileRecord } from "@/entities/support/types/types"
import { FileUpload } from "@/features/fileUpload/ui/FileUpload"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/shared/ui/inputGroup"
import { Loader, MessageCircleQuestionMark, Send } from "lucide-react"
import { useSupport } from "../hooks/useSupport"

export const SupportForm = () => {
  const { form, FormProvider, onSubmit, handleFileChange, isCreating, attachedFiles } = useSupport()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Написать в поддержку</CardTitle>
        <CardDescription>Опишите вашу проблему, и мы обязательно поможем</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              disabled={isCreating}
              name={"subject"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема обращения</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <MessageCircleQuestionMark className="h-4 w-4" />
                      </InputGroupAddon>
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
              name={"message"}
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

            <FileUpload<SupportFileRecord>
              fileSlots={[
                {
                  id: "attachments",
                  label: "Прикрепить файлы (опционально)",
                  multiple: true,
                },
              ]}
              uploadedFiles={attachedFiles}
              onFileChange={handleFileChange}
              disabled={isCreating}
            />

            <Button type="submit" disabled={isCreating} className="w-full" size="lg">
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
