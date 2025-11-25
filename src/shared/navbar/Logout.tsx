import React from "react";
import { useAuth } from "@/Store";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="icon"
      className="w-10 h-10 cursor-pointer rounded-full ring-2 ring-red-600  hover:ring-red-600 dark:ring-red-600 hover:dark:ring-red-600
      transition-colors duration-200 group bg-white hover:bg-[] dark:bg-black "
    >
      <LogOut
        size={18}
        strokeWidth={2}
        className="text-black dark:text-white 
        group-hover:text-red-600 dark:group-hover:text-red-600 
        transition-colors duration-200 "
      />
    </Button>
  );
};

export default LogoutButton;
