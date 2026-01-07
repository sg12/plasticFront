import { Label } from "@radix-ui/react-label";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/entities/auth/model/store";

export const PublicRoute = () => {
    const { session, loading } = useAuthStore();

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

    if (session) {
        return <Navigate to="/main" replace />;
    }

    return <Outlet />;
};