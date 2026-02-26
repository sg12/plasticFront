import { Users, MoreHorizontal, Mail, GraduationCap, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
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
import { EmptyState } from "@/shared/ui/emptyState"
import { ErrorState } from "@/shared/ui/errorState"
import { Skeleton } from "@/shared/ui/skeleton"

import { pluralRu } from "@/shared/lib/utils"
import { useArchiveRelationship, useRelationships } from "@/entities/relationship/api/relationship.queries"
import { InviteDoctorButton } from "@/features/inviteDoctorButton/ui/InviteDoctorButton"
import type { Relationship } from "@/entities/relationship/types/relationship.types"
import { SPECIALIZATION_LOCALES } from "@/entities/doctor/model/doctor.constants"
import { Badge } from "@/shared/ui/badge"

export const ClinicDoctorsList = () => {
  const { data: relationships, isLoading, error, refetch } = useRelationships()
  const archive = useArchiveRelationship()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-9 w-[140px]" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <ErrorState
        error={error instanceof Error ? error.message : "Ошибка загрузки"}
        title="Не удалось загрузить список врачей"
        onRetry={refetch}
      />
    )
  }

  const hasRelationships = relationships && relationships.length > 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Users className="h-5 w-5 shrink-0 text-purple-600" />
            Список сотрудников
          </CardTitle>
          <InviteDoctorButton />
        </div>
      </CardHeader>
      <CardContent>
        {!hasRelationships ? (
          <div className="py-10">
            <EmptyState
              icon={Users}
              title="Врачи не найдены"
              description="Ваш штат пока пуст. Самое время пригласить первого специалиста."
            />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[250px]">Врач</TableHead>
                  <TableHead>Специализация</TableHead>
                  <TableHead>Опыт</TableHead>
                  <TableHead>Дата добавления</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relationships.map((relationship: Relationship) => {
                  const { doctor } = relationship

                  return (
                    <TableRow key={doctor.id} className="group transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{doctor.fullName}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {doctor.user.fullName || "Нет почты"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {doctor.specializations && doctor.specializations.length > 0 ? (
                            doctor.specializations.map((specKey) => {
                              const label = SPECIALIZATION_LOCALES[specKey as keyof typeof SPECIALIZATION_LOCALES]?.ru || specKey;

                              return (
                                <Badge
                                  key={specKey}
                                  variant="primary"
                                >
                                  {label}
                                </Badge>
                              );
                            })
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {typeof doctor.experience === 'number'
                            ? pluralRu(doctor.experience, "год", "года", "лет")
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(doctor.createdAt), "d MMM yyyy", { locale: ru })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => window.location.href = `mailto:${doctor.email}`}
                              disabled={!doctor.email}
                            >
                              Написать письмо
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                  Исключить из клиники
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Доктор <strong>{doctor.user.fullName}</strong> потеряет доступ к системе клиники.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => archive.mutate(doctor.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    {archive.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Подтвердить исключение"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}