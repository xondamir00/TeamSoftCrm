import { useAuth } from "@/Store";
import { Navigate } from "react-router-dom";

export type Role = "ADMIN" | "teacher";

interface RoleRouteProps {
  roles: Role[];
  children: React.ReactNode;
}

export function Private({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/sign" replace />;
}

export function RoleRoute({ roles, children }: RoleRouteProps) {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/sign" replace />;
  }

  if (!roles.includes(user.role as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
