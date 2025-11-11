import { motion, AnimatePresence } from "framer-motion";
import AddStudent from "./AddStudent";
import { X } from "lucide-react";

function AddStudentDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-black shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Add New Student</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <AddStudent />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddStudentDrawer;
