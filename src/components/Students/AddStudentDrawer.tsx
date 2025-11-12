import { motion, AnimatePresence } from "framer-motion";
import AddStudent from "./AddStudent";
import { X } from "lucide-react";
import { Button } from "../ui/button";

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
            className="fixed inset-0 bg-blue-400 z-40 cursor-pointer"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-blue-400 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-white">
                Add New Student
              </h2>
              <Button onClick={onClose} className="">
                <X className="w-5 h-5 text-white " />
              </Button>
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
