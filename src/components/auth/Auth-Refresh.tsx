// src/components/auth/Auth-Refresh.tsx
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
    // token yo‘q bo‘lsa faqat /sign sahifasiga yo‘naltir
    if (!token && location.pathname !== "/sign") {
      navigate("/sign");
    } else {
      setBooted(true);
    }
  }, [token, location, navigate, setBooted]);

  if (!booted) return null; // token tekshirilmaguncha hech narsa ko‘rsatmaydi

  return <>{children}</>;
}
