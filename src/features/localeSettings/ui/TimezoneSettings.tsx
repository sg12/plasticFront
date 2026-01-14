import { MapPin } from "lucide-react"
import { Label } from "@/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { useLocaleSettings } from "../hooks/useLocaleSettings"
import { CardDescription } from "@/shared/ui/card"

export const TimezoneSettings = () => {
  const { timezone, setTimezone, timezones } = useLocaleSettings()

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="timezone" className="mb-2 flex items-center gap-2">
          <MapPin className="text-muted-foreground h-4 w-4" />
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
        <CardDescription className="mt-2">
          Текущий часовой пояс: <span className="font-medium">{timezone}</span>
        </CardDescription>
      </div>
    </div>
  )
}
