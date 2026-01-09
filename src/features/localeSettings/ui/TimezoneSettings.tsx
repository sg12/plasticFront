import { MapPin } from "lucide-react"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { useLocaleSettings } from "../hooks/useLocaleSettings"

export const TimezoneSettings = () => {
  const { timezone, setTimezone, detectTimezone, timezones } = useLocaleSettings()

  return (
    <div className="space-child">
      <Label htmlFor="timezone" className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        Часовой пояс
      </Label>
      <div className="flex gap-2">
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger id="timezone" className="flex-1">
            <SelectValue placeholder="Выберите часовой пояс" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-gray-500">Текущий часовой пояс: {timezone}</p>
    </div>
  )
}
