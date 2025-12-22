import { useState } from "react"
import type { BodyZone } from "@/features/aiVisualization/types/types"
import { BODY_ZONES, FACE_ZONES, BODY_ZONES_LIST } from "@/features/aiVisualization/model/constants"
import { cn } from "@/shared/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { User, Smile } from "lucide-react"
import { Item, ItemContent, ItemDescription, ItemTitle } from "../../../shared/ui/item"

interface BodySelectorProps {
  selectedZone: BodyZone | null
  onSelectZone: (zone: BodyZone) => void
}

export const BodySelector = ({ selectedZone, onSelectZone }: BodySelectorProps) => {
  const [activeTab, setActiveTab] = useState<"face" | "body">("face")

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Выберите зону</h2>
        <p className="text-gray-500">Укажите область, которую хотите визуализировать</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "face" | "body")}
        className="w-full"
      >
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="face" className="flex items-center gap-2">
            <Smile className="size-4" />
            Лицо
          </TabsTrigger>
          <TabsTrigger value="body" className="flex items-center gap-2">
            <User className="size-4" />
            Тело
          </TabsTrigger>
        </TabsList>

        <TabsContent value="face" className="mt-0">
          <div className="grid gap-4 lg:grid-cols-4">
            {FACE_ZONES.map((zoneId) => {
              const zone = BODY_ZONES[zoneId]
              return (
                <Item
                  key={zoneId}
                  variant="outline"
                  asChild
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedZone === zoneId &&
                      "border-violet-500 bg-violet-50 shadow-md shadow-violet-500/10",
                  )}
                  onClick={() => onSelectZone(zoneId)}
                >
                  <a>
                    <ItemContent>
                      <ItemTitle>{zone.label}</ItemTitle>
                      <ItemDescription>{zone.description}</ItemDescription>
                    </ItemContent>
                  </a>
                </Item>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="body" className="mt-0">
          <div className="grid grid-cols-4 gap-4">
            {BODY_ZONES_LIST.map((zoneId) => {
              const zone = BODY_ZONES[zoneId]
              return (
                <Item
                  key={zoneId}
                  variant="outline"
                  asChild
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedZone === zoneId &&
                      "border-violet-500 bg-violet-50 shadow-md shadow-violet-500/10",
                  )}
                  onClick={() => onSelectZone(zoneId)}
                >
                  <a>
                    <ItemContent>
                      <ItemTitle>{zone.label}</ItemTitle>
                      <ItemDescription>{zone.description}</ItemDescription>
                    </ItemContent>
                  </a>
                </Item>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
