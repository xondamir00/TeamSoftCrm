import { Navigate } from "react-router-dom";
import { useAuth } from "@/Store";

interface RoleRouteProps {
  roles: string[];
  children: React.ReactNode;
}

export const RoleRoute = ({ roles, children }: RoleRouteProps) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/sign" replace />;
  }

  if (user && !roles.includes(user.role.toLowerCase())) {
    return <Navigate to="/sign" replace />;
  }

  return <>{children}</>;
};
