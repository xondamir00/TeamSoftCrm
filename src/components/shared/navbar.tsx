import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import Logo from "./logo";

const Navbar = () => {
  return (
    <header className="w-full h-20 bg-[#3F8CFF] shadow-md">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex justify-between items-center h-full">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <Button className="relative text-white hover:text-indigo-200 transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Avatar className="cursor-pointer ring-2 ">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button className="text-white hover:text-indigo-200 transition hidden md:inline-flex">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;