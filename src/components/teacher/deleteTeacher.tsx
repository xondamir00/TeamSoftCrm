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
  const [loading, setLoading] = useState(false);

  if (!teacher) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/teachers/${teacher.id}`);
      if (onDeleted) onDeleted();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="dark:bg-gray-900 dark:text-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-gray-100">
            {`O‘qituvchini o‘chirish`}
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-gray-300">
            {teacher.fullName ||
              `${teacher.firstName || ""} ${teacher.lastName || ""}`}  
            o‘chirilishini xohlaysizmi?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            onClick={onClose}
            className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 dark:text-gray-100"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            O‘chirish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
