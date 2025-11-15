"use client";

import { useAuth } from "@/Store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ useAuth store-dan real foydalanuvchi ma’lumotini oling

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="cursor-pointer hover:opacity-80 transition w-10 h-10 ring-2 ring-white">
          <AvatarImage src={user?.avatarUrl || ""} />
          <AvatarFallback>
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 shadow-lg border bg-white dark:bg-neutral-900"
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatarUrl || ""} />
            <AvatarFallback>
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs opacity-60">{user?.phone}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate("/admin/settings")}
          className="flex gap-2 cursor-pointer"
        >
          <Settings size={16} />
          Sozlamalar
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate("/admin/settings/archive")}
          className="flex gap-2 cursor-pointer text-red-500 focus:text-red-600"
        >
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
