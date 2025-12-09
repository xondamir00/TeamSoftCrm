"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Group } from "@/Store/Group/GroupInterface";
import AddGroupForm from "@/Featured/Group/AddGoupForm";

export interface GroupModalProps {
  isOpen: boolean;
  editingGroup: Group | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function GroupModal({
  isOpen,
  editingGroup,
  onClose,
  onSuccess,
}: GroupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 w-full sm:max-w-md h-full flex flex-col shadow-xl border-l border-gray-200 dark:border-gray-700"
      >
        <ModalHeader editingGroup={editingGroup} onClose={onClose} />
        <div className="p-4 overflow-y-auto flex-1">
          <AddGroupForm
            editingGroup={editingGroup}
            onSuccess={() => {
              onClose();
              onSuccess();
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

interface ModalHeaderProps {
  editingGroup: Group | null;
  onClose: () => void;
}

function ModalHeader({ editingGroup, onClose }: ModalHeaderProps) {
  const title = editingGroup ? "Edit Group" : "Add Group";

  return (
    <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
      <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
      <Button
        variant="outline"
        onClick={onClose}
        className="rounded-xl dark:border-gray-600"
      >
        Close
      </Button>
    </div>
  );
}
