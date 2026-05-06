import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./UserContextComponent";

export function ProtectedRoute({ requireAdmin = false }) {
    const { user } = useContext(UserContext);
    if (!user) return <Navigate to="/login" replace />;
    if (requireAdmin && user["user-role"] !== "admin") return <Navigate to="/" replace />;
    return <Outlet />;
}
