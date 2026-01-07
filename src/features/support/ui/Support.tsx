import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Phone, MessageCircle, MessageSquare, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { useSupportTickets, useCreateSupportTicket } from "../hooks/useSupport"
import { CONTACT_METHODS, WORKING_HOURS } from "../model/constants"
import { createSupportTicketSchema, type CreateSupportTicketFormData } from "../model/schema"

import { FileUpload } from "@/features/fileUpload/ui/FileUpload"
import type { FileRecord } from "@/features/fileUpload/types/types"
import { TicketCard } from "@/features/support/ui/TicketCard"

const iconMap = {
  Mail,
  Phone,
  MessageCircle,
  MessageSquare,
}

type SupportFileRecord = FileRecord & {
  attachments?: File | File[]
}

export const Support = () => {
  const [attachedFiles, setAttachedFiles] = useState<SupportFileRecord>({})
  const {
    tickets,
    isLoading: isLoadingTickets,
    error,
  } = useSupportTickets()
  const { createTicket, isCreating } = useCreateSupportTicket()

  const form = useForm<CreateSupportTicketFormData>({
    resolver: zodResolver(createSupportTicketSchema),
    defaultValues: {
      subject: "",
      message: "",
      attachments: [],
    },
  })

  const onSubmit = async (data: CreateSupportTicketFormData) => {
    const files: File[] = []
    if (attachedFiles.attachments) {
      if (Array.isArray(attachedFiles.attachments)) {
        files.push(...attachedFiles.attachments)
      } else {
        files.push(attachedFiles.attachments)
      }
    }

    try {
      await createTicket({
        subject: data.subject,
        message: data.message,
        attachments: files.length > 0 ? files : undefined,
      })

      form.reset()
      setAttachedFiles({})
    } catch (error) {}
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: keyof SupportFileRecord,
  ) => {
    const files = Array.from(e.target.files || [])

    // Проверка на максимальное количество файлов
    const existingFiles = attachedFiles.attachments
      ? Array.isArray(attachedFiles.attachments)
        ? attachedFiles.attachments
        : [attachedFiles.attachments]
      : []

    const totalFiles = existingFiles.length + files.length

    if (totalFiles > 5) {
      form.setError("attachments", {
        type: "manual",
        message: "Можно прикрепить максимум 5 файлов",
      })
      e.target.value = ""
      return
    }

    setAttachedFiles((prev) => ({
      ...prev,
      [fileType]: files.length > 1 ? files : files[0],
    }))
  }

  return (
    <div className="space-y-4">
      <div>
        <h2>Поддержка</h2>
        <p className="mt-2 text-gray-600">Свяжитесь с нами для получения помощи</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Способы связи</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Часы работы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
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

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Написать в поддержку</CardTitle>
              <CardDescription>Опишите вашу проблему, и мы обязательно поможем</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                    Тема обращения *
                  </label>
                  <Input
                    id="subject"
                    {...form.register("subject")}
                    placeholder="Например: Проблема с регистрацией"
                    className={form.formState.errors.subject ? "border-red-500" : ""}
                  />
                  {form.formState.errors.subject && (
                    <p className="mt-1 text-sm text-red-500">
                      {form.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    Сообщение *
                  </label>
                  <Textarea
                    id="message"
                    {...form.register("message")}
                    placeholder="Опишите вашу проблему подробно..."
                    rows={6}
                    className={form.formState.errors.message ? "border-red-500" : ""}
                  />
                  {form.formState.errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <div>
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
                  />
                </div>

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Мои обращения</CardTitle>
              <CardDescription>История ваших обращений в поддержку</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTickets ? (
                <div className="py-8 text-center text-gray-500">Загрузка...</div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : tickets && tickets.length > 0 ? (
                <div className="space-y-4">
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
