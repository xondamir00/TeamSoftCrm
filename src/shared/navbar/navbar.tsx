"use client";

import { motion } from "framer-motion";
import Logo from "./logo";
import { ModeToggle } from "../modeToggle";
import LanguageSwitcher from "@/i18react/LanguageSwitcher";

const Navbar = () => {
  return (
    <motion.header className="w-full h-[75px] bg-[#3F8CFF] dark:bg-black shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex justify-between items-center h-full">
        {/* Chap tomondagi logo */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Logo />
        </motion.div>

        {/* O‘ng tomondagi elementlar */}
        <motion.div
          className="flex justify-between items-center gap-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <LanguageSwitcher />
          <ModeToggle />
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Navbar;
