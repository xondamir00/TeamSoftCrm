import React from "react";
import { useAuth } from "@/Store";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      onClick={handleLogout}
      variant={"outline"}
    >
      {t("logout")}
    </Button>
  );
};

export default LogoutButton;
