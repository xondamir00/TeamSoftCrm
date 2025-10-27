"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Logo = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
   <>
  
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link
        to="/"
        aria-label="Home"
        className="flex items-center gap-2 text-white select-none"
      >
        <motion.div
          whileHover={{ rotate: 10, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center bg-white/20 dark:bg-white/10 rounded-xl p-2 backdrop-blur-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isScrolled ? 50 : 36}
            height={isScrolled ? 50 : 36}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </motion.div>
        <motion.div
          className={`hidden md:block font-spaceGrotesk font-bold tracking-tight whitespace-nowrap ${
            isScrolled ? "text-2xl" : "text-3xl"
          }`}
          transition={{ duration: 0.3 }}
        >
          {t("welcomeCRM")}
        </motion.div>
      </Link>
    </motion.div>
   </>
  );
};

export default Logo;
