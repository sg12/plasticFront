import { Clock, MessageCircleQuestionMark, RefreshCw, Send } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { useSupport } from "../hooks/useSupport"
import { WORKING_HOURS } from "../../../entities/support/model/constants"

import { FileUpload } from "@/features/fileUpload/ui/FileUpload"
import { TicketCard } from "@/features/support/ui/TicketCard"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/shared/ui/inputGroup"
import { cn } from "@/shared/lib/utils"

type SupportFileRecord = {
  attachments?: File | File[]
}

export const Support = () => {
  const {
    tickets,
    isLoadingTickets,
    isLoadingReplies,
    ticketsError: error,
    form,
    FormProvider,
    onSubmit,
    handleFileChange,
    isCreating,
    attachedFiles,
    refreshReplies,
  } = useSupport()

  return (
    <div className="space-global">
      <div>
        <h2>Поддержка</h2>
        <p className="mt-2 text-gray-600">Свяжитесь с нами для получения помощи</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-global lg:col-span-1">
          {/* <Card>
            <CardHeader>
              <CardTitle>Способы связи</CardTitle>
            </CardHeader>
            <CardContent className="space-child">
              {CONTACT_METHODS.map((method) => {
                const Icon = iconMap[method.icon as keyof typeof iconMap]
                return (
                  <div key={method.type} className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-50 p-2">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-normal">{method.label}</p>
                      <p className="text-sm text-gray-600">{method.value}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Часы работы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-child text-sm">
                {WORKING_HOURS.days.map((day, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{day}</span>
                    <span>{WORKING_HOURS.hours[index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-global lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Написать в поддержку</CardTitle>
              <CardDescription>Опишите вашу проблему, и мы обязательно поможем</CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-global">
                  <FormField
                    control={form.control}
                    disabled={isLoadingTickets || isCreating}
                    name={"subject"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тема обращения</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <MessageCircleQuestionMark />
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
                    disabled={isLoadingTickets || isCreating}
                    name={"message"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Сообщение</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupTextarea
                              id="message"
                              placeholder="Опишите вашу проблему подробно..."
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
                        label: "Прикрепить файлы (опционально, максимум 5)",
                        multiple: true,
                      },
                    ]}
                    uploadedFiles={attachedFiles}
                    onFileChange={handleFileChange}
                    disabled={isLoadingTickets || isCreating}
                  />

                  <Button type="submit" disabled={isCreating} className="w-full">
                    {isCreating ? (
                      <>Отправка...</>
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

          <Card>
            <CardHeader>
              <CardTitle>Мои обращения</CardTitle>
              <CardDescription>История ваших обращений в поддержку</CardDescription>
              <CardAction>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refreshReplies()}
                  disabled={isLoadingReplies || isCreating}
                >
                  <RefreshCw className={cn(isLoadingReplies && "animate-spin", "h-4 w-4")} />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {isLoadingReplies ? (
                <div className="py-8 text-center text-gray-500">Загрузка...</div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : tickets && tickets.length > 0 ? (
                <div className="space-global">
                  {tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>У вас пока нет обращений в поддержку</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
