"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { DeleteModalProps } from "@/Store/Group/GroupInterface";

export function DeleteModal({
  group,
  loading,
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  const { t } = useTranslation();

  if (!group) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold dark:text-white mb-2">
          {t("groupManagement.deleteGroup") || "Delete Group"}
        </h2>
        <p className="dark:text-gray-300 mb-4">
          {t("groupManagement.deleteConfirm", { name: group.name }) || 
            `Are you sure you want to delete "${group.name}"?`}
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-xl dark:border-gray-600"
          >
            {t("groupManagement.cancel") || "Cancel"}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("groupManagement.loading") || "Loading..."}
              </>
            ) : (
              t("groupManagement.delete") || "Delete"
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}