import { useState } from "react"
import { UserPlus, Loader } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog"
import { useInviteDoctor } from "@/entities/relationship/api/relationship.queries"

export const InviteDoctorButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [doctorId, setDoctorId] = useState("")
    const invite = useInviteDoctor()

    const handleInvite = () => {
        const trimmedId = doctorId.trim()
        if (!trimmedId) return

        invite.mutate(trimmedId, {
            onSuccess: () => {
                setDoctorId("")
                setIsOpen(false)
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Добавить врача
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Приглашение в штат</DialogTitle>
                    <DialogDescription>
                        Введите уникальный идентификатор (ID) врача для отправки запроса на сотрудничество.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Input
                        placeholder="Например: 550e8400-e29b-41d4-a716..."
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        disabled={invite.isPending}
                        onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                        autoFocus
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => setIsOpen(false)}
                        disabled={invite.isPending}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleInvite}
                        disabled={invite.isPending || !doctorId.trim()}
                    >
                        {invite.isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Отправить запрос
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}