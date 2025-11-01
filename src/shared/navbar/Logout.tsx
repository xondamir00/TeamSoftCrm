import React from "react";
import { useAuth } from "@/Store";
import { Button } from "@/components/ui/button";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button onClick={handleLogout} variant={"outline"}>
      Logout
    </Button>
  );
};

export default LogoutButton;
