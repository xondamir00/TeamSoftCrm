"use client";

import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";

type LangOption = {
  code: string;
  name: string;
  flag: string;
};

const languages: LangOption[] = [
  { code: "uz", name: "O‘zbek", flag: "/flags/uz.png" },
  { code: "ru", name: "Русский", flag: "/flags/ru.png" },
  { code: "en", name: "English", flag: "/flags/en.png" },
];

export function LanguageSwitcher() {
  const { i18n: i18next } = useTranslation();
  const [lang, setLang] = useState(i18next.language || "uz");

  const toggleLanguage = () => {
    const currentIndex = languages.findIndex((l) => l.code === lang);
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLang = languages[nextIndex].code;
    i18next.changeLanguage(nextLang);
    setLang(nextLang);
  };

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="flex items-center justify-center w-10 h-10 ring-2 ring-white rounded-full border bg-[#0208B0] dark:bg-black"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Language switcher"
          onClick={(e) => {
            e.preventDefault();
            toggleLanguage();
          }}
        >
          {/* Smooth flag animation */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentLang.code}
              src={currentLang.flag}
              alt={currentLang.name}
              className="w-6 h-6 rounded-full object-cover"
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
        </motion.button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
