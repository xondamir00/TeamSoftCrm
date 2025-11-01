import React from "react";
import { useAuth } from "@/Store";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Zustand store'dagi user, token, refreshToken ni tozalaydi
    navigate("/sign", { replace: true }); // Login sahifasiga qaytaradi
  };

  return (
    <Button
      onClick={handleLogout}
      variant={'outline'}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
