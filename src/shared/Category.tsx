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
      {/* Desktop Navbar */}
      <AnimatePresence>
        <motion.div
          key="desktop-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="
            hidden md:flex mt-4
            bg-white dark:bg-slate-900 backdrop-blur-xl
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
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            variant="ghost"
                            className={`
                              flex items-center gap-2 px-5 py-4 text-lg rounded-xl
                              transition-all duration-200 
                              shadow-sm hover:shadow-md
                              ${
                                active
                                  ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white shadow-blue-300/50"
                                  : "text-gray-800 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-slate-800"
                              }
                            `}
                          >
                            <img
                              src={item.icon}
                              width={22}
                              height={22}
                              className={`transition ${active ? "brightness-0 invert" : "dark:invert"}`}
                              alt=""
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

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-end p-3 bg-white dark:bg-slate-900 shadow-md">
        <Button
          variant="outline"
          size="icon"
          className="border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200/20 dark:hover:bg-slate-800"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setOpen(false)}
              />

              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="fixed top-0 right-0 w-72 h-full bg-white dark:bg-slate-900 shadow-xl z-50 flex flex-col"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-gray-900 dark:text-white text-lg font-semibold tracking-wide">
                    {t("categories")}
                  </h2>

                  <motion.button
                    onClick={() => setOpen(false)}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-200/30 dark:hover:bg-slate-800 transition"
                  >
                    <svg
                      className="w-5 h-5 text-gray-900 dark:text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Categories List */}
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
                      <Link to={item.href} key={item.label} onClick={() => setOpen(false)}>
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
                                  ? "bg-blue-600 text-white shadow-md shadow-blue-300/50"
                                  : "text-gray-800 dark:text-gray-200 hover:bg-gray-100/20 dark:hover:bg-slate-800"
                              }
                            `}
                          >
                            <img
                              src={item.icon}
                              width={26}
                              height={26}
                              alt=""
                              className={`transition ${active ? "brightness-0 invert" : "dark:invert"}`}
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
