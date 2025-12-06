"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/Service/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Teacher } from "@/Store";
import { useTranslation } from "react-i18next";

interface DeleteTeacherProps {
  teacher: Teacher | null;
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function DeleteTeacherDialog({
  teacher,
  open,
  onClose,
  onDeleted,
}: DeleteTeacherProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  if (!teacher) return null;

  const isActive = teacher.isActive;

  const handleUpdateActive = async () => {
    setLoading(true);
    try {
      await api.patch(`/teachers/${teacher.id}`, {
        isActive: !isActive,
      });
      onDeleted?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <div className="fixed  flex items-center justify-center z-50 p-4">
        <AlertDialogContent className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? t("delete_teacher") : t("restore_teacher")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {teacher.fullName ||
                `${teacher.firstName || ""} ${teacher.lastName || ""}`}{" "}
              {isActive
                ? t("delete_teacher_confirm")
                : t("restore_teacher_confirm")}
            </AlertDialogDescription>
            <p
              className={`mt-2 text-sm font-semibold ${
                isActive ? "text-red-500" : "text-green-600"
              }`}
            >
              {t("status")}: {isActive ? t("active") : t("inactive")}
            </p>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={onClose}
              className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-xl"
            >
              {t("cancel")}
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={loading}
              onClick={handleUpdateActive}
              className={`rounded-xl dark:text-gray-100 ${
                isActive
                  ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              }`}
            >
              {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              {isActive ? t("delete") : t("restore")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  );
}
