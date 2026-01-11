/**
 * @fileoverview Компонент поиска в каталоге
 */

import { Search } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"

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
  return (
    <InputGroup>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </InputGroup>
  )
}
