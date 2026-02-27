import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import {
  Select,
  SelectContent,
  SelectGroupAddon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Mars, Venus, VenusAndMars, X } from "lucide-react"
import { USER_GENDER } from "@/entities/user/model/user.constants"
import { useState } from "react"
import { Badge } from "@/shared/ui/badge"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/shared/ui/inputGroup"
import type { ProfileProps } from "@/entities/profile/types/profile.types"
import { patientFields } from "@/entities/profile/model/profile.constants"
import { SelectBirthDate } from "@/features/user-management/profile/create/ui/selectBirthDate/ui/SelectBirthDate"

export const PatientForm = ({ mode = "edit", form, isSaving }: ProfileProps) => {
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
                        <InputGroup>
                          <InputGroupTextarea
                            {...formField}
                            value={formField.value ?? ""}
                            placeholder={field.placeholder}
                            disabled={isViewMode}
                          />
                        </InputGroup>
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
                        <InputGroup className={isViewMode ? "flex-wrap" : "grid"}>
                          {tags.length > 0 && (
                            <InputGroupAddon className="flex-wrap justify-start">
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
                            className={!isViewMode ? "border-t-1" : ""}
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
          )
          }
        />
      ))}
    </div >
  )
}