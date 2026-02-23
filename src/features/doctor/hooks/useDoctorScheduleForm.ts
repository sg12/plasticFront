/**
 * @fileoverview Хук для управления формой расписания врача
 *
 * Инкапсулирует логику загрузки и обновления расписания врача
 *
 * @module features/doctor/hooks/useDoctorScheduleForm
 */

import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppointmentsStore } from "@/entities/appointment/model/appointment.store"
import { fullDoctorScheduleSchema } from "@/entities/appointment/model/appointment.schema"
import type { DoctorSchedule } from "@/entities/appointment/types/appointment.types"
import type z from "zod"
import {
  MIN_HOURS_BEFORE_APPOINTMENT,
  DEFAULT_TIME_SLOT_DURATION,
} from "@/entities/appointment/model/appointment.constants"
import { useUserStore } from "@/entities/user/model/user.store"

type DoctorScheduleFormData = z.infer<typeof fullDoctorScheduleSchema>

export const useDoctorScheduleForm = () => {
  const { doctorSchedule, isLoadingSchedule, loadDoctorSchedule, updateSchedule } =
    useAppointmentsStore()
  const { profile } = useUserStore()

  const form = useForm<DoctorScheduleFormData>({
    resolver: zodResolver(fullDoctorScheduleSchema),
    defaultValues: {
      doctorId: profile?.id,
      schedule: [],
      defaultDuration: DEFAULT_TIME_SLOT_DURATION,
      minHoursBeforeAppointment: MIN_HOURS_BEFORE_APPOINTMENT,
    },
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: "schedule",
  })

  // Загружаем расписание при монтировании
  useEffect(() => {
    if (profile?.id) {
      loadDoctorSchedule(profile.id)
    }
  }, [profile?.id, loadDoctorSchedule])

  useEffect(() => {
    if (doctorSchedule && doctorSchedule.doctorId === profile?.id) {
      form.reset({
        doctorId: doctorSchedule.doctorId,
        schedule: doctorSchedule.schedule,
        defaultDuration: doctorSchedule.defaultDuration,
        minHoursBeforeAppointment: doctorSchedule.minHoursBeforeAppointment,
      })
    } else if (!isLoadingSchedule && !doctorSchedule) {
      form.reset({
        doctorId: profile?.id,
        schedule: [],
        defaultDuration: DEFAULT_TIME_SLOT_DURATION,
        minHoursBeforeAppointment: MIN_HOURS_BEFORE_APPOINTMENT,
      })
    }
  }, [doctorSchedule, profile?.id, isLoadingSchedule, form])

  const onSubmit = async (data: DoctorScheduleFormData) => {
    if (!profile?.id) return
    await updateSchedule(profile.id, data as DoctorSchedule)
  }

  return {
    form,
    fields,
    isLoadingSchedule,
    onSubmit,
  }
}
