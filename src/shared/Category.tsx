"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { CategoryNavigate } from "@/constants";

export default function CategoryNav() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="desktop-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="
            hidden md:flex mt-4
            bg-white/80 dark:bg-black/80 backdrop-blur-xl
            border border-gray-200 dark:border-white/10 
            shadow-xl rounded-2xl
            w-[98%] mx-auto p-3 
          "
        >
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex w-full justify-between gap-3 flex-wrap">
              {CategoryNavigate.map((item) => {
                const active = isActive(item.href);
                return (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink asChild>
                      <Link to={item.href}>
                        <motion.div
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button
                            variant="ghost"
                            className='flex items-center gap-2 px-5 py-4 text-lg rounded-xl transition-all duration-200 '
                          >
                            <img
                              src={item.icon}
                              width={22}
                              height={22}
                              className="dark:invert"
                            />
                            {t(item.label)}
                          </Button>
                        </motion.div>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </motion.div>
      </AnimatePresence>
      <div className="md:hidden flex justify-end p-3 bg-[#0208B0] dark:bg-black shadow-md">
        <Button
          variant="outline"
          size="icon"
          className="border-white/40 bg-transparent text-white hover:bg-white/20"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="fixed top-0 right-0 w-72 h-full bg-[#0208B0] dark:bg-black shadow-xl z-50 flex flex-col"
              >
                <div className="p-4 border-b border-white/30 flex items-center justify-between">
                  <h2 className="text-white text-lg font-semibold tracking-wide">
                    {t("categories")}
                  </h2>
                  <motion.button
                    onClick={() => setOpen(false)}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                  }}
                  className="flex flex-col gap-3 p-4 overflow-y-auto"
                >
                  {CategoryNavigate.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        to={item.href}
                        key={item.label}
                        onClick={() => setOpen(false)}
                      >
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: 30 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div
                            className={`
                              w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base
                              transition-all duration-200
                              ${
                                active
                                  ? "bg-white/20 text-white border border-white/40 shadow-md shadow-white/30"
                                  : "text-white hover:bg-white/10"
                              }
                            `}
                          >
                            <img
                              src={item.icon}
                              width={26}
                              height={26}
                              alt=""
                              style={{ filter: "brightness(0) invert(1)" }}
                            />
                            {t(item.label)}
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
