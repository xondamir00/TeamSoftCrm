"use client";

import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/i18react/LanguageSwitcher";
import AccountMenu from "./AvatarDemo";
import Logo from "./logo";
import { ModeToggle } from "./modeToggle";

const Navbar = () => {
  return (
<div className="bg-[#3F8CFF] dark:bg-black w-full">
      <motion.header
      className="w-full h-[75px] bg-[#3F8CFF] dark:bg-black shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex justify-between items-center h-full">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Logo />
        </motion.div>
        <motion.div
          className="flex justify-between items-center gap-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <LanguageSwitcher />
          <ModeToggle />
          <AccountMenu />
        </motion.div>
      </div>
    </motion.header>
</div>
  );
};

export default Navbar;
