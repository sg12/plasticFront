import { Label } from "@radix-ui/react-label";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/entities/auth/model/store";
import { USER_ROLES } from "@/entities/user/model/constants";
import { Button } from "@/shared/ui/button";

export const ProtectedRoute = () => {
    const { session, loading, profile, signOut } = useAuthStore();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Loader
                    role="status"
                    aria-label="Loading"
                    className="size-4 animate-spin"
                />
                <Label>Загрузка...</Label>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/signin" replace />;
    }

    const isDoctorOrClinic =
        profile?.role === USER_ROLES.DOCTOR || profile?.role === USER_ROLES.CLINIC;
    const isApproved = profile?.moderation_status === "approved";

    if (isDoctorOrClinic && !isApproved) {
        return (
            <div className="h-screen w-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-lg border bg-background p-6 space-y-3">
                    <div className="text-lg font-semibold">Заявка на модерацию отправлена</div>
                    <div className="text-sm text-muted-foreground">
                        Мы проверяем данные и документы. Доступ к кабинету будет открыт после
                        подтверждения.
                    </div>
                    <div className="text-sm">
                        Статус:{" "}
                        <span className="font-medium">
                            {profile?.moderation_status}
                        </span>
                    </div>
                    <div className="pt-2">
                        <Button variant="outline" onClick={() => signOut()}>
                            Выйти
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return <Outlet />;
};