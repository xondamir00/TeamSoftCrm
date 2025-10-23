import { LanguageSwitcher } from "@/i18react/LanguageSwitcher";
import AccountMenu from "./AvatarDemo";
import Logo from "./logo";
import { ModeToggle } from "./modeToggle";

const Navbar = () => {
  return (
    <header className="w-full h-20 bg-[#3F8CFF] dark:bg-black">
      <div className=" mx-auto px-4 lg:px-6 flex justify-between items-center h-full">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="flex justify-between items-center gap-4">
          <LanguageSwitcher/>
          <ModeToggle/>
        <AccountMenu/>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
