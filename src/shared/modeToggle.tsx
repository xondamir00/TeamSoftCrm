import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/themeProvider/theme";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"light" | "dark" | "system">(
    theme || "system"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const nextTheme = mode === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setMode(nextTheme);
  };

  if (!mounted) return null;

  return (
    <motion.button
      onClick={handleToggle}
      className="relative flex items-center justify-center w-10 h-10 ring-2 ring-white rounded-full border  bg-[#3F8CFF]  dark:bg-black"
      whileTap={{ scale: 1.1 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mode === "light" ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-5 h-5 text-white" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -90, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5 text-blue-400" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}