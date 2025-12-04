import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/Store";

interface AuthRefreshProps {
  children: React.ReactNode;
}

export function AuthRefresh({ children }: AuthRefreshProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setBooted, booted } = useAuth();

  useEffect(() => {
    if (!token && location.pathname !== "/sign") {
      navigate("/sign");
    } else {
      setBooted(true);
    }
  }, [token, location, navigate, setBooted]);

  if (!booted) return null;

  return <>{children}</>;
}
