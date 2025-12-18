import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth/model/store";

export const App = () => {
    const { initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return <Outlet />;
};
