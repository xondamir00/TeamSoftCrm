"use client";

import { motion, AnimatePresence } from "framer-motion";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import AddStudentForm from "./AddStudent";
import { useTranslation } from "react-i18next";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function AddStudentDrawer({ open, onClose }: DrawerProps) {
  const {t} =useTranslation()
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("add_student")}
              </h2>
              <Button
                onClick={onClose}
                variant="ghost"
                className="hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5 text-gray-800 dark:text-white" />
              </Button>
            </div>

            {/* Form */}
            <div className="p-4">
              <AddStudentForm />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
