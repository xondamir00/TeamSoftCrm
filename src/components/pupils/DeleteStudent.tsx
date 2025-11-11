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

interface DeleteStudentProps {
  student: any | null;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function DeleteStudentDialog({
  student,
  open,
  onClose,
  onUpdated,
}: DeleteStudentProps) {
  const [loading, setLoading] = useState(false);

  if (!student) return null;

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      await api.delete(`/students/${student.id}`);
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {student.isActive ? "Deactivate Student?" : "Restore Student?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {student.isActive
              ? `${student.fullName} foydalanuvchisini o‘chirilsinmi?`
              : `${student.fullName} qayta faollashtirilsinmi?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={handleToggleActive}
            className={
              student.isActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }
          >
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            {student.isActive ? "Deactivate" : "Restore"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
