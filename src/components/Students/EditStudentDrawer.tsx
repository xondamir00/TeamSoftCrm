import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import EditStudent from "./EditStudent";

interface EditStudentDrawerProps {
  open: boolean;
  onClose: () => void;
  studentId: string;
  onUpdated?: () => void;
}

export default function EditStudentDrawer({
  open,
  onClose,
  studentId,
  onUpdated,
}: EditStudentDrawerProps) {
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-gray-100 dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-gray-200">
                Edit Student
              </h2>
              <Button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4">
              <EditStudent studentId={studentId} onUpdated={onUpdated} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
