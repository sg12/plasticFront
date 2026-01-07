import type { UseFormReturn } from "react-hook-form"

export type Mode = "edit" | "view"

export interface Props {
  form: UseFormReturn<any>
  mode?: Mode
  isSaving?: boolean
}
