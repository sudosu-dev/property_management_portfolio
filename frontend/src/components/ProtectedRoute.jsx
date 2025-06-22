import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children, requireManager = false }) {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/" />;

  if (requireManager && !user.is_manager) {
    return <Navigate to="/dashboard/resident" />;
  }
  return children;
}
