/**
 * @fileoverview Компонент поиска в каталоге
 */

import { Search, X, LoaderIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"

interface CatalogSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isLoading?: boolean
}

export const CatalogSearch = ({
  value,
  onChange,
  placeholder = "Поиск...",
  isLoading = false,
}: CatalogSearchProps) => {
  const handleClear = () => {
    onChange("")
  }

  return (
    <InputGroup>
      <InputGroupAddon>
        {isLoading ? (
          <LoaderIcon className="text-muted-foreground h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("pr-10", isLoading && "opacity-70")}
        disabled={isLoading}
      />
      {value && !isLoading && (
        <InputGroupAddon align="inline-end">
          <Button
            type="button"
            variant="ghost"
            size="iconSm"
            onClick={handleClear}
            aria-label="Очистить поиск"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
