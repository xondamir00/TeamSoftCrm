"use client";

import { motion } from "framer-motion";
import Logo from "./logo";
import { ModeToggle } from "../modeToggle";
import LanguageSwitcher from "@/i18react/LanguageSwitcher";
import ProfileModal from "@/shared/navbar/profile";
const Navbar = () => {
  return (
    <motion.header  className="w-full py-3 bg-[#0208B0] shadow-sm dark:bg-[rgb(0,0,0,0.5)]">
      <div className="mx-auto px-4 lg:px-6 flex justify-between items-center">

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
        </motion.div>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LanguageSwitcher />
          <ModeToggle />
          <ProfileModal />
        </motion.div>

      </div>
    </motion.header>
  );
};

export default Navbar;
