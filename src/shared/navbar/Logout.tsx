"use client";

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
      className="
        flex items-center gap-2
        px-2 
        bg-transparent
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition
      "
    >
      <div
        className="
          w-6 h-6 flex items-center justify-center
          rounded-full
          ring-2 ring-red-600 dark:ring-red-600
          bg-white dark:bg-black
          hover:ring-red-700 dark:hover:ring-red-500
          transition 
        "
      >
        <LogOut
          size={12}
          strokeWidth={2}
          className="text-red-600 dark:text-red-500"
        />
      </div>
      <span className="text-black dark:text-white ">
        Chiqish
      </span>
    </Button>
  );
};

export default LogoutButton;
