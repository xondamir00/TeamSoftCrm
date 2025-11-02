import { Navigate } from "react-router-dom";
import { useAuth } from "@/Store";

interface RoleRouteProps {
  roles: string[];
  children: React.ReactNode;
}

export const RoleRoute = ({ roles, children }: RoleRouteProps) => {
  const { user, token, booted } = useAuth();

  // ⏳ 1. AuthRefresh hali tugamagan bo‘lsa, kutamiz
  if (!booted) return null;

  // ❌ 2. Agar token yoki user yo‘q bo‘lsa — login sahifasiga yuboramiz
  if (!token || !user) return <Navigate to="/sign" replace />;

  // 🚫 3. Rol mos kelmasa, ruxsat yo‘q
  if (!roles.includes(user.role)) return <Navigate to="/sign" replace />;

  // ✅ 4. Hammasi joyida — bolani render qilamiz
  return <>{children}</>;
};
