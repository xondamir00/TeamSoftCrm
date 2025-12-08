"use client";

import { useState } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

interface Enrollment {
  id: string;
  status: "ACTIVE" | "PAUSED" | "LEFT";
  joinDate: string;
  leaveDate?: string;
  student: { id: string; fullName: string };
  group: { id: string; name: string };
}

interface Props {
  enrollment: Enrollment;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function EditEnrollmentDrawer({
  enrollment,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();

  const [status, setStatus] = useState<Enrollment["status"]>(enrollment.status);
  const [leaveDate, setLeaveDate] = useState<string>(
    enrollment.leaveDate
      ? new Date(enrollment.leaveDate).toISOString().split("T")[0]
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/enrollments/${enrollment.id}`, {
        status,
        leaveDate: leaveDate || undefined,
      });
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || t("server_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white w-full max-w-md p-6 shadow-xl relative"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">{t("edit_enrollment")}</h2>

        {error && (
          <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("error_occurred")}</AlertDialogTitle>
                <AlertDialogDescription>{error}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setError(null)}>
                  {t("close")}
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">{t("status")}</Label>
            <select
              id="status"
              className="border rounded w-full p-2 mt-1"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as Enrollment["status"])
              }
            >
              <option value="ACTIVE">{t("active")}</option>
              <option value="PAUSED">{t("paused")}</option>
              <option value="LEFT">{t("left")}</option>
            </select>
          </div>

          {status === "LEFT" && (
            <div>
              <Label htmlFor="leaveDate">{t("leave_date")}</Label>
              <Input
                id="leaveDate"
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />
              )}
              {t("save")}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
