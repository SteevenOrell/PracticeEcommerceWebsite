import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./UserContextComponent";

// UX guard only: it hides screens from users who shouldn't see them. It is NOT an
// authorisation boundary — the data APIs behind admin screens must enforce access.
export function ProtectedRoute({ requireAdmin = false }) {
    const { user } = useContext(UserContext);
    if (!user) return <Navigate to="/login" replace />;
    if (requireAdmin && user["user-role"] !== "admin") return <Navigate to="/" replace />;
    return <Outlet />;
}
