import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut } from "lucide-react";
import Logo from "./logo";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="w-full h-20 bg-[#3F8CFF] shadow-md">
      <div className=" mx-auto px-4 lg:px-6 flex justify-between items-center h-full">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <Button className="relative text-blue-600 bg-white transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Avatar className="cursor-pointer ring-4 ring-white ">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button className="text-blue-600 bg-white transition hidden md:inline-flex">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
