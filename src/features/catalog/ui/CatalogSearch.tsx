/**
 * @fileoverview Компонент поиска в каталоге
 */

import { Search, X } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Button } from "@/shared/ui/button"

interface CatalogSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const CatalogSearch = ({
  value,
  onChange,
  placeholder = "Поиск...",
}: CatalogSearchProps) => {
  const handleClear = () => {
    onChange("")
  }

  return (
    <InputGroup>
      <InputGroupAddon>
        <Search className="h-4 w-4" />
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
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
