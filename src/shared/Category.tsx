"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const { t, i18n } = useTranslation();

  const isActive = (href: string) => location.pathname === href;

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return (
    <>
      {/* Desktop menu */}
      <div className="hidden bg-white border shadow-md md:flex justify-center py-3 my-4 w-[98%] mx-auto rounded-2xl dark:bg-black">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-3 flex-wrap">
            {CategoryNavigate.map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink asChild>
                  <Link to={item.href}>
                    <Button
                      variant="ghost"
                      className="flex items-center text-xl gap-2 px-4 py-6 border rounded-md transition-all duration-200"
                    >
                      <img
                        src={item.icon}
                        alt={t(item.label)}
                        width={20}
                        height={20}
                        className="dark:invert"
                      />
                      <span>{t(item.label)}</span>
                    </Button>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile menu */}
      <div className="flex justify-end md:hidden p-3 bg-[#3F8CFF] dark:bg-black">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-white/50 text-white hover:bg-white/10 bg-[#3F8CFF]"
            >
              <Menu className="h-5 w-5 text-white dark:text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 bg-[#3F8CFF] dark:bg-black">
            <SheetHeader className="p-4 border-b border-white/30 dark:border-white/50">
              <SheetTitle className="text-white">{t("categories")}</SheetTitle>
            </SheetHeader>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col space-y-2 p-4 bg-[#3F8CFF] dark:bg-black"
                >
                  {CategoryNavigate.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-transform duration-200 hover:scale-[1.02]
                            ${
                              active
                                ? "bg-white/20 border border-white text-white dark:bg-white/10 dark:border-white dark:text-white"
                                : "text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/10"
                            }`}
                        >
                          <img
                            src={item.icon}
                            alt={t(item.label)}
                            width={22}
                            height={22}
                            className="text-white"
                            style={{ filter: "brightness(0) invert(1)" }}
                          />
                          <span>{t(item.label)}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
