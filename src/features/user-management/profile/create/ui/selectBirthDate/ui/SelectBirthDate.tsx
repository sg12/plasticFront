import { useIsMobile } from "@/shared/hooks/useMobile"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/shared/ui/drawer"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/inputGroup"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { format } from "date-fns"
import { CalendarDays } from "lucide-react"
import { Calendar } from "@/shared/ui/calendar"
import { useState } from "react"
import type { ControllerRenderProps } from "react-hook-form"

interface Props {
    isViewMode: boolean
    field: { id: string }
    formField: ControllerRenderProps<any, string>
}

export const SelectBirthDate = ({ isViewMode, field, formField }: Props) => {
    const isMobile = useIsMobile()
    const [open, setOpen] = useState(false)

    let eighteenYearsAgo = new Date()
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)

    const calendar = (formField: ControllerRenderProps<any, string>) => {
        return (
            <Calendar
                className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
                mode="single"
                defaultMonth={formField.value ? new Date(formField.value) : eighteenYearsAgo}
                selected={formField.value ? new Date(formField.value) : undefined}
                onSelect={(date) => {
                    if (date) {
                        const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                        setOpen(false)
                        formField.onChange(normalized)
                    } else {
                        setOpen(false)
                        formField.onChange(undefined)
                    }
                }}
                captionLayout="dropdown"
                disabled={[
                    {
                        after: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
                    },
                    { before: new Date(1920, 0, 1) },
                ]}
            />
        )
    }

    return (
        (!isMobile ? (
            <Popover>
                <PopoverTrigger asChild disabled={isViewMode}>
                    <InputGroup>
                        <InputGroupAddon>
                            <CalendarDays />
                        </InputGroupAddon>
                        <InputGroupInput
                            readOnly
                            id={field.id}
                            disabled={isViewMode}
                            className="cursor-pointer"
                            placeholder="Выберите дату"
                            value={
                                formField.value ? format(new Date(formField.value), "dd.MM.yyyy") : ""
                            }
                        />
                    </InputGroup>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                    {calendar(formField)}
                </PopoverContent>
            </Popover>
        ) : (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild disabled={isViewMode}>
                    <InputGroup>
                        <InputGroupAddon>
                            <CalendarDays />
                        </InputGroupAddon>
                        <InputGroupInput
                            readOnly
                            id={field.id}
                            disabled={isViewMode}
                            className="cursor-pointer"
                            placeholder="Выберите дату"
                            value={
                                formField.value ? format(new Date(formField.value), "dd.MM.yyyy") : ""
                            }
                        />
                    </InputGroup>
                </DrawerTrigger>
                <DrawerContent className="w-auto overflow-hidden p-0">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>Select date</DrawerTitle>
                        <DrawerDescription>Set your date of birth</DrawerDescription>
                    </DrawerHeader>
                    {calendar(formField)}
                </DrawerContent>
            </Drawer>
        ))
    )
}