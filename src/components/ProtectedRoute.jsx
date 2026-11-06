import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route guard. Not logged in -> /login.
 * Logged in with the wrong role -> that role's own home page.
 * This is the module-wise redirection: Admin pages for admins, User pages for users.
 */
export default function ProtectedRoute({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/feedback"} replace />;
  }
  return <Outlet />;
}
