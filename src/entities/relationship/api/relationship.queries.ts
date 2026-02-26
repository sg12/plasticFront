import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getRelationships,
  inviteDoctor,
  changeStatus,
  archiveRelationship,
} from "../api/relationship.api"
import { toast } from "sonner"
import type { RELATIONSHIP_STATUS } from "../types/relationship.types"

export const relationshipKeys = {
  all: ["relationships"] as const,
  list: () => [...relationshipKeys.all, "list"] as const,
}

export const useRelationships = () => {
  return useQuery({
    queryKey: relationshipKeys.list(),
    queryFn: getRelationships,
    staleTime: 1000 * 60 * 5,
  })
}

export const useInviteDoctor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (doctorId: string) => inviteDoctor(doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: relationshipKeys.list() })
      toast.success("Приглашение отправлено")
    },
    onError: () => {
      toast.error("Не удалось отправить приглашение")
    },
  })
}

export const useChangeRelationshipStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RELATIONSHIP_STATUS }) =>
      changeStatus(id, status),
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: relationshipKeys.list() })
      toast.success(`Статус обновлен на: ${updatedData.status}`)
    },
  })
}

export const useArchiveRelationship = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => archiveRelationship(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: relationshipKeys.list() })
      toast.success("Взаимодействие архивировано")
    },
  })
}
