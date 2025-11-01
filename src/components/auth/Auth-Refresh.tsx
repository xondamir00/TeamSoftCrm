import { useEffect } from "react";
import { api } from "../../Service/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Store";

interface AuthRefreshProps {
  children: React.ReactNode;
}

export function AuthRefresh({ children }: AuthRefreshProps) {
  const navigate = useNavigate();
  const { token, refreshToken, login, logout, booted, setBooted } = useAuth();

  useEffect(() => {
    if (booted) return;

    const refreshTokenFunc = async () => {
      try {
        if (!token && refreshToken) {
          const { data } = await api.post("/auth/refresh", { token: refreshToken });
          if (data?.accessToken && data?.refreshToken && data.user) {
            login(data.accessToken, data.refreshToken, data.user);
            
          } else {
            logout();
            navigate("/sign", { replace: true });
          }
        } else if (!token && !refreshToken) {
          logout();
          navigate("/sign", { replace: true });
        }
      } catch (err) {
        logout();
        navigate("/sign", { replace: true });
      } finally {
        setBooted(true);
      }
    };

    refreshTokenFunc();
  }, [booted, token, refreshToken, login, logout, navigate, setBooted]);

  if (!booted) return null;
  return <>{children}</>;
}
