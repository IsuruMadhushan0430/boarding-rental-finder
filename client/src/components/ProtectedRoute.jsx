import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    const dashboardPath =
      user.role === "admin"
        ? "/admin/dashboard"
        : user.role === "landlord"
          ? "/landlord/dashboard"
          : user.role === "seeker"
            ? "/my-inquiries"
            : "/";
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;