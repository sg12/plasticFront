import { Link } from "react-router"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import {
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Check,
  X,
  ExternalLink,
  Users,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import { ErrorState } from "@/shared/ui/errorState"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
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

import { ROUTES } from "@/shared/model/routes"
import type { Relationship } from "@/entities/relationship/types/relationship.types"
import { useChangeRelationshipStatus, useRelationships } from "@/entities/relationship/api/relationship.queries"
import { RELATIONSHIP_STATUS, RELATIONSHIP_STATUS_LOCALES } from "@/entities/relationship/model/relationship.constants"

export const DoctorClinicsList = () => {
  // 1. Получаем данные через твой Query
  const { data: clinics = [], isLoading, error, refetch } = useRelationships();

  // 2. Получаем мутацию для смены статуса
  const { mutateAsync: updateStatus, isPending: isUpdating } = useChangeRelationshipStatus();

  // Обработчики действий
  const handleAccept = async (id: string) => {
    await updateStatus({ id, status: RELATIONSHIP_STATUS.APPROVED });
  };

  const handleReject = async (id: string) => {
    await updateStatus({ id, status: RELATIONSHIP_STATUS.REJECTED });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    )
  }

  if (error) {
    return <ErrorState error={error} title="Не удалось загрузить данные" onRetry={refetch} />
  }

  // Фильтрация по статусам для группировки в таблице
  const pending = clinics.filter((c) => c.status === RELATIONSHIP_STATUS.PENDING)
  const accepted = clinics.filter((c) => c.status === RELATIONSHIP_STATUS.APPROVED)
  const others = clinics.filter((c) => c.status !== RELATIONSHIP_STATUS.PENDING && c.status !== RELATIONSHIP_STATUS.APPROVED)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Building2 className="h-5 w-5 text-purple-600" />
          Мои клиники и приглашения
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[300px]">Клиника</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="hidden md:table-cell">Дата события</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Приглашения */}
              {pending.map((m) => (
                <ClinicRow
                  key={m.id}
                  relationship={m}
                  isPending
                  onAccept={handleAccept}
                  onReject={handleReject}
                  isProcessing={isUpdating}
                />
              ))}

              {/* Активные */}
              {accepted.map((m) => (
                <ClinicRow key={m.id} relationship={m} />
              ))}

              {/* История */}
              {others.map((m) => (
                <ClinicRow key={m.id} relationship={m} isHistory />
              ))}

              {clinics.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    Список пуст
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

interface ClinicRowProps {
  relationship: Relationship;
  isPending?: boolean;
  isHistory?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  isProcessing?: boolean;
}

const ClinicRow = ({
  relationship,
  isPending,
  onAccept,
  onReject,
  isProcessing
}: ClinicRowProps) => {
  if (!relationship) return null

  return (
    <TableRow className={isPending ? "bg-amber-50/30 dark:bg-amber-950/10" : ""}>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{relationship.clinic.legalName}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {relationship.clinic.actualAddress || "Адрес не указан"}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <StatusBadge status={relationship.status} />
      </TableCell>

      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
        {isPending ? (
          <span>Отправлено: {format(new Date(relationship.updatedAt), "d MMM yyyy", { locale: ru })}</span>
        ) : (
          <span>{relationship.createdAt ? format(new Date(relationship.createdAt), "d MMM yyyy", { locale: ru }) : "—"}</span>
        )}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {isPending && onAccept && onReject ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    disabled={isProcessing}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Принять приглашение?</AlertDialogTitle>
                    <AlertDialogDescription>Вы станете сотрудником клиники "{relationship.clinic.legalName}".</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onAccept(relationship.id)} className="bg-green-600">Принять</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Отклонить приглашение?</AlertDialogTitle>
                    <AlertDialogDescription>Это действие нельзя отменить.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Назад</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onReject(relationship.id)} className="bg-destructive">Отклонить</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild className="h-8">
              <Link to={ROUTES.PROFILE_SOME_USER.replace(":userId", relationship.clinic.user.id)}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    [RELATIONSHIP_STATUS.PENDING]: { label: [RELATIONSHIP_STATUS_LOCALES[RELATIONSHIP_STATUS.PENDING].ru], icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
    [RELATIONSHIP_STATUS.APPROVED]: { label: [RELATIONSHIP_STATUS_LOCALES[RELATIONSHIP_STATUS.APPROVED].ru], icon: CheckCircle, className: "bg-green-100 text-green-700 border-green-200" },
    [RELATIONSHIP_STATUS.REJECTED]: { label: [RELATIONSHIP_STATUS_LOCALES[RELATIONSHIP_STATUS.REJECTED].ru], icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
    [RELATIONSHIP_STATUS.ARCHIVED]: { label: [RELATIONSHIP_STATUS_LOCALES[RELATIONSHIP_STATUS.ARCHIVED].ru], icon: Users, className: "bg-slate-100 text-slate-700 border-slate-200" },
  }[status] || { label: status, icon: Clock, className: "" }

  const Icon = config.icon
  return (
    <Badge variant="outline" className={`font-normal whitespace-nowrap ${config.className}`}>
      <Icon className="mr-1 h-3 w-3" /> {config.label}
    </Badge>
  )
}