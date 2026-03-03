import { Badge } from "@/shared/ui/badge";
import { Gem } from "lucide-react";
import { useMe } from "@/entities/user/api/user.queries";

export const TokenBadge = () => {
    const { data: user } = useMe();
    if (user?.aiToken === undefined) return null;

    return (
        <Badge variant={user.aiToken === 0 ? "outline" : "primary"} className="gap-2">
            <Gem className="size-3" />
            {user.aiToken === 0 ? "Токены закончились" : `Токенов: ${user.aiToken}`}
        </Badge>
    );
};