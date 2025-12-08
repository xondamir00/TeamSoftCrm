import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../../components/ui/button";
import EditStudent from "./EditStudent";
import { useTranslation } from "react-i18next";

interface EditStudentDrawerProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  onUpdated?: () => void;
}

export default function EditStudentDrawer({
  open,
  onClose,
  studentId,
  onUpdated,
}: EditStudentDrawerProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 dark:bg-black z-40 cursor-pointer"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 shadow-2xl z-50 overflow-y-auto p-4 sm:p-6"
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-gray-200">
                {t("edit_student")}
              </h2>
              <Button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <EditStudent studentId={studentId} onUpdated={onUpdated} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
