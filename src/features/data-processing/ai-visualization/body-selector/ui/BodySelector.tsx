import { useState } from "react"
import { cn } from "@/shared/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Smile, User } from "lucide-react"
import { Item, ItemContent, ItemTitle } from "@/shared/ui/item"
import { useVisualizerStore } from "@/entities/ai-visualization/model/ai-visualization.store"
import { ZONES_CONST } from "@/entities/ai-visualization/model/ai-visualization.constants"

export const BodySelector = () => {
  const setZone = useVisualizerStore((state) => state.setZone)
  const selectedZone = useVisualizerStore((state) => state.zone)
  const [activeTab, setActiveTab] = useState<"face" | "body">("face")

  const zones = Object.entries(ZONES_CONST)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Выберите зону</h2>
        <p className="text-muted-foreground text-sm">Укажите область для визуализации</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "face" | "body")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="face" className="gap-2"><Smile size={16} />Лицо</TabsTrigger>
          <TabsTrigger value="body" className="gap-2"><User size={16} />Тело</TabsTrigger>
        </TabsList>

        {["face", "body"].map((cat) => (
          <TabsContent key={cat} value={cat} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {zones
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .filter(([_, z]) => z.category === cat)
              .map(([id, z]) => (
                <Item
                  key={id}
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedZone === id && "border-primary bg-primary/5 ring-1 ring-primary"
                  )}
                  onClick={() => setZone(id)}
                >
                  <ItemContent>
                    <ItemTitle>{z.title}</ItemTitle>
                  </ItemContent>
                </Item>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}