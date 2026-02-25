import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import {
  Select,
  SelectContent,
  SelectGroupAddon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Mars, Venus, VenusAndMars, X } from "lucide-react"
import type { Props } from "./types/types"
import { patientFields } from "@/widgets/roleForms/model/constants"
import { SelectBirthDate } from "@/features/selectBirthDate/ui/SelectBirthDate"
import { USER_GENDER } from "@/entities/user/model/user.constants"
import { useState } from "react"
import { Badge } from "@/shared/ui/badge"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/shared/ui/inputGroup"
import { cn } from "@/shared/lib/utils"

export const PatientForm = ({ mode = "edit", form, isSaving }: Props) => {
  const isViewMode = mode === "view" || !!isSaving
  const [tagInput, setTagInput] = useState("")

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {patientFields.map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          disabled={isViewMode}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className={field.type === "textarea" ? "lg:col-span-2" : ""}>
              <FormLabel>
                {field.label}
                {field.optional && (
                  <span className="text-muted-foreground text-xs font-normal italic">
                    {" (опционально)"}
                  </span>
                )}
              </FormLabel>
              <FormControl>
                {(() => {
                  switch (field.type) {
                    case "select":
                      return (
                        <Select
                          onValueChange={formField.onChange}
                          value={formField.value ?? undefined}
                          disabled={isViewMode}
                        >
                          <SelectTrigger>
                            <SelectGroupAddon>
                              {formField.value === USER_GENDER.MALE ? (
                                <Mars className="w-4 h-4" />
                              ) : formField.value === USER_GENDER.FEMALE ? (
                                <Venus className="w-4 h-4" />
                              ) : (
                                <VenusAndMars className="w-4 h-4" />
                              )}
                              <SelectValue
                                id={field.id}
                                placeholder={`Выберите ${field.label.toLowerCase()}`}
                              />
                            </SelectGroupAddon>
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((opt) => (
                              <SelectItem key={opt.value} id={field.id} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )

                    case "date":
                      return (
                        <SelectBirthDate
                          isViewMode={isViewMode}
                          field={field}
                          formField={formField}
                        />
                      )

                    case "textarea":
                      return (
                        <Textarea
                          {...formField}
                          value={formField.value ?? ""}
                          placeholder={field.placeholder}
                          disabled={isViewMode}
                          className="min-h-[80px] resize-none"
                        />
                      )

                    case "tags": {
                      const tags: string[] = Array.isArray(formField.value) ? formField.value : [];

                      const capitalize = (str: string) =>
                        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

                      const addTag = (val: string) => {
                        const trimmed = val.trim();
                        if (trimmed) {
                          const formattedTag = capitalize(trimmed);
                          if (!tags.includes(formattedTag)) {
                            formField.onChange([...tags, formattedTag]);
                          }
                        }
                        setTagInput("");
                      };

                      return (
                        <InputGroup className="flex-wrap">
                          {tags.length > 0 && (
                            <InputGroupAddon align="inline-start" className="flex-wrap">
                              {tags.map((tag, index) => (
                                <Badge
                                  key={`${tag}-${index}`}
                                  variant="secondary"
                                  className="flex gap-1"
                                >
                                  {tag}
                                  {!isViewMode && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        formField.onChange(tags.filter((t) => t !== tag));
                                      }}
                                      className="hover:text-destructive transition-colors"
                                    >
                                      <X className="size-3" />
                                    </button>
                                  )}
                                </Badge>
                              ))}
                            </InputGroupAddon>
                          )}

                          <InputGroupInput
                            id={`input-${field.id}`}
                            readOnly={isViewMode}
                            placeholder={isViewMode ? "" : (tags.length === 0 ? field.placeholder : "Добавить...")}
                            value={tagInput}
                            disabled={isViewMode}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTag(tagInput);
                              }
                              if (e.key === "Backspace" && !tagInput && tags.length > 0) {
                                formField.onChange(tags.slice(0, -1));
                              }
                            }}
                            onBlur={() => addTag(tagInput)}
                          />

                          {isViewMode && tags.length === 0 && (
                            <InputGroupText className="pl-3 italic opacity-70">
                              Не указано
                            </InputGroupText>
                          )}
                        </InputGroup>
                      );
                    }

                    default:
                      return (
                        <InputGroup>
                          <InputGroupInput
                            {...formField}
                            value={formField.value ?? ""}
                            placeholder={field.placeholder}
                            disabled={isViewMode} />
                        </InputGroup>
                      )
                  }
                })()}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}