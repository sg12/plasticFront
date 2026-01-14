/**
 * @fileoverview Виджет для управления врачами клиники
 *
 * Позволяет клинике:
 * - Просматривать список своих врачей
 * - Добавлять врачей по ID
 * - Удалять врачей из клиники
 */

import { useState } from "react"
import { useClinicDoctors } from "@/features/clinicManagement/hooks/useClinicDoctors"
import { useInviteDoctor } from "@/features/clinicManagement/hooks/useInviteDoctor"
import { useRemoveDoctor } from "@/features/clinicManagement/hooks/useRemoveDoctor"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Skeleton } from "@/shared/ui/skeleton"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alertDialog"
import { Users, UserPlus, Trash2, Loader, Stethoscope, Mail, Phone, Briefcase } from "lucide-react"
import { pluralRu } from "@/shared/lib/utils"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface ClinicDoctorsListProps {
  clinicId: string | undefined
}

export const ClinicDoctorsList = ({ clinicId }: ClinicDoctorsListProps) => {
  const { doctors, isLoading, error, refresh } = useClinicDoctors(clinicId)
  const { inviteDoctor, isInviting } = useInviteDoctor(clinicId, refresh)
  const { removeDoctor, isRemoving } = useRemoveDoctor(clinicId, refresh)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [doctorIdInput, setDoctorIdInput] = useState("")
  const [doctorToRemove, setDoctorToRemove] = useState<string | null>(null)

  const handleInvite = async () => {
    const success = await inviteDoctor(doctorIdInput)
    if (success) {
      setDoctorIdInput("")
      setIsAddDialogOpen(false)
    }
  }

  const handleRemove = async () => {
    if (doctorToRemove) {
      await removeDoctor(doctorToRemove)
      setDoctorToRemove(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Врачи клиники
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Добавить врача
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить врача в клинику</DialogTitle>
                <DialogDescription>
                  Введите ID врача, которого вы хотите пригласить в клинику. Врач получит
                  приглашение и сможет принять или отклонить его.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="doctorId" className="text-sm font-medium">
                    ID врача
                  </label>
                  <Input
                    id="doctorId"
                    placeholder="Введите ID врача"
                    value={doctorIdInput}
                    onChange={(e) => setDoctorIdInput(e.target.value)}
                    disabled={isInviting}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isInviting}
                >
                  Отмена
                </Button>
                <Button onClick={handleInvite} disabled={isInviting || !doctorIdInput.trim()}>
                  {isInviting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    "Отправить приглашение"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : doctors.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-muted-foreground">В клинике пока нет врачей</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Добавьте врачей, чтобы они могли работать в вашей клинике
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map((membership) => {
              const doctor = membership.doctor
              if (!doctor) return null

              return (
                <div
                  key={membership.id}
                  className="hover:bg-accent/50 flex items-start justify-between gap-4 rounded-lg border p-4 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-purple-600" />
                      <h4 className="font-medium">{doctor.fullName}</h4>
                    </div>

                    <div className="text-muted-foreground grid gap-2 text-sm sm:grid-cols-2">
                      {doctor.specialization && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3 w-3" />
                          <span>{doctor.specialization}</span>
                        </div>
                      )}
                      {doctor.experience !== null && doctor.experience !== undefined && (
                        <div>Опыт: {pluralRu(doctor.experience, "год", "года", "лет")}</div>
                      )}
                      {doctor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{doctor.email}</span>
                        </div>
                      )}
                      {doctor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{doctor.phone}</span>
                        </div>
                      )}
                      {membership.acceptedAt && (
                        <div className="text-xs">
                          Принят:{" "}
                          {format(new Date(membership.acceptedAt), "dd MMMM yyyy", { locale: ru })}
                        </div>
                      )}
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={isRemoving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить врача из клиники?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Вы уверены, что хотите удалить {doctor.fullName} из списка врачей клиники?
                          Это действие нельзя отменить.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            setDoctorToRemove(doctor.id)
                            await handleRemove()
                          }}
                          className="bg-destructive hover:bg-destructive/90"
                          disabled={isRemoving}
                        >
                          {isRemoving ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Удаление...
                            </>
                          ) : (
                            "Удалить"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
