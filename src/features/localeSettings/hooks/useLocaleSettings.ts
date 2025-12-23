import React, { useState, useCallback } from "react"

const TIMEZONE_KEY = "app_timezone"

const TIMEZONES: { value: string; label: string }[] = [
  { value: "Europe/Moscow", label: "Москва (GMT+3)" },
  { value: "Europe/Kaliningrad", label: "Калининград (GMT+2)" },
  { value: "Europe/Samara", label: "Самара (GMT+4)" },
  { value: "Asia/Yekaterinburg", label: "Екатеринбург (GMT+5)" },
  { value: "Asia/Omsk", label: "Омск (GMT+6)" },
  { value: "Asia/Novosibirsk", label: "Новосибирск (GMT+7)" },
  { value: "Asia/Irkutsk", label: "Иркутск (GMT+8)" },
  { value: "Asia/Yakutsk", label: "Якутск (GMT+9)" },
  { value: "Asia/Vladivostok", label: "Владивосток (GMT+10)" },
  { value: "Asia/Magadan", label: "Магадан (GMT+11)" },
  { value: "Asia/Kamchatka", label: "Камчатка (GMT+12)" },
  { value: "UTC", label: "UTC (GMT+0)" },
  { value: "Europe/London", label: "Лондон (GMT+0/+1)" },
  { value: "Europe/Berlin", label: "Берлин (GMT+1/+2)" },
  { value: "America/New_York", label: "Нью-Йорк (GMT-5/-4)" },
  { value: "America/Los_Angeles", label: "Лос-Анджелес (GMT-8/-7)" },
  { value: "Asia/Tokyo", label: "Токио (GMT+9)" },
  { value: "Asia/Shanghai", label: "Шанхай (GMT+8)" },
  { value: "Asia/Dubai", label: "Дубай (GMT+4)" },
]

function getDefaultTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return "Europe/Moscow"
  }
}

export function useLocaleSettings() {
  const [timezone, setTimezoneState] = useState<string>(() => {
    const saved = localStorage.getItem(TIMEZONE_KEY)
    if (saved) return saved
    return getDefaultTimezone()
  })

  const setTimezone = useCallback((tz: string) => {
    setTimezoneState(tz)
    localStorage.setItem(TIMEZONE_KEY, tz)
  }, [])

  const detectTimezone = useCallback(() => {
    const detected = getDefaultTimezone()
    setTimezone(detected)
  }, [setTimezone])

  return {
    timezone,
    setTimezone,
    detectTimezone,
    timezones: TIMEZONES,
  }
}

export function formatDateWithTimezone(
  date: Date | string,
  timezone?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const tz = timezone || localStorage.getItem(TIMEZONE_KEY) || getDefaultTimezone()
  const d = typeof date === "string" ? new Date(date) : date

  return d.toLocaleString("ru-RU", {
    timeZone: tz,
    ...options,
  })
}
