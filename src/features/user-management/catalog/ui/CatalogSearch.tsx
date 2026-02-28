/**
 * @fileoverview Компонент поиска в каталоге
 */

import { Search, X, LoaderIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
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
    <InputGroup className="bg-background">
      <InputGroupAddon>
        {isLoading ? (
          <LoaderIcon className="text-muted-foreground h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-6 w-6" />
        )}
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(isLoading && "opacity-70")}
        disabled={isLoading}
      />
      {value && !isLoading && (
        <InputGroupAddon align="inline-end">
          <X onClick={handleClear} aria-label="Очистить поиск" className="size-4 cursor-pointer" />
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
