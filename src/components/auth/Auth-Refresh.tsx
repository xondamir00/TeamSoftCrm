import { useEffect } from "react";
import { useAuth } from "@/Store";
import { api } from "../../Service/api";
import { useNavigate } from "react-router-dom";

interface AuthRefreshProps {
  children: React.ReactNode;
}

export function AuthRefresh({ children }: AuthRefreshProps) {
  const { token, login, logout, booted, setBooted } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (booted) return;

    const refreshToken = async () => {
      try {
        if (!token) {
          // Refresh qilish uchun API chaqiriq
          const { data } = await api.post("/auth/refresh");

          if (data?.accessToken && data.user) {
            login(data.accessToken, data.user);
          } else {
            logout();
            navigate("/sign", { replace: true });
          }
        }
      } catch (err) {
        logout();
        navigate("/sign", { replace: true });
      } finally {
        setBooted(true);
      }
    };

    refreshToken();
  }, [booted, token]);

  // Booted bo‘lmaguncha hech narsa ko‘rsatilmaydi
  if (!booted) return null;

  return <>{children}</>;
}
