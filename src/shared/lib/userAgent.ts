export const parseBrowser = (ua: string): string => {
  if (ua.includes("Edg/")) return "Edge"
  if (ua.includes("Chrome")) return "Chrome"
  if (ua.includes("Firefox")) return "Firefox"
  if (ua.includes("Safari")) return "Safari"
  if (ua.includes("Opera")) return "Opera"
  return "Неизвестный"
}

export const parseOS = (ua: string): string => {
  if (ua.includes("Windows")) return "Windows"
  if (ua.includes("Mac OS")) return "macOS"
  if (ua.includes("Linux")) return "Linux"
  if (ua.includes("Android")) return "Android"
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS"
  return "Неизвестная"
}

export const parseDevice = (ua: string): string => {
  if (ua.includes("Mobile") || ua.includes("Android")) return "Мобильный"
  if (ua.includes("Tablet") || ua.includes("iPad")) return "Планшет"
  return "Компьютер"
}
