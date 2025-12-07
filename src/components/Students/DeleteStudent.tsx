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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useStudentStore } from "@/Store/Student";
import { t } from "i18next";

interface Student {
  id: number;
  fullName: string;
}

interface DeleteStudentProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function DeleteStudentDialog({
  student,
  open,
  onClose,
  onDeleted,
}: DeleteStudentProps) {
  const [loading, setLoading] = useState(false);
  const deleteStudent = useStudentStore((state) => state.deleteStudent);

  if (!student) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteStudent(student.id);
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
     <div className="fixed  flex items-center justify-center z-50 p-4 ">
       <AlertDialogContent className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-gray-100">
            Delete Student?
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-gray-300">
            Siz <span className="font-semibold">{student.fullName}</span> foydalanuvchisini o'chirilsinmi?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel
              disabled={loading}
              onClick={onClose}
              className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-xl"
            >
              {t("cancel")}
            </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={handleDelete}
            className="rounded-xl px-4 py-2 flex items-center justify-center bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 dark:text-gray-100"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
     </div>
    </AlertDialog>
  );
}
