"use client";

import { useState, useEffect } from "react";
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
import { useEnrollmentStore } from "@/Store/Enrollment";

interface Student {
  id: string;
  fullName: string;
  phone?: string;
}
interface Group {
  id: string;
  name: string;
}
interface Props {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function CreateEnrollmentDrawer({ onClose, onSuccess }: Props) {
  const { t } = useTranslation();

  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [studentId, setStudentId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [joinDate, setJoinDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const students = useEnrollmentStore((state) => state.students);
  const groups = useEnrollmentStore((state) => state.groups);
  const fetchStudents = useEnrollmentStore((state) => state.fetchStudents);
  const fetchGroups = useEnrollmentStore((state) => state.fetchGroups);
  const createEnrollment = useEnrollmentStore((state) => state.createEnrollment);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchStudents(), fetchGroups()]);
      } catch {
        setError(t("fetch_error"));
      }
    };

    fetchData();
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId || !groupId) {
      setError(t("select_student_group"));
      return;
    }

    setLoading(true);
    try {
      await createEnrollment({
        studentId: Number(studentId),
        groupId: Number(groupId),
        joinDate: joinDate || undefined,
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

        <h2 className="text-2xl font-bold mb-4">{t("create_enrollment")}</h2>

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
            <Label htmlFor="student">{t("student")}</Label>
            <select
              id="student"
              className="border rounded w-full p-2 mt-1"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="">{t("select")}</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="group">{t("group")}</Label>
            <select
              id="group"
              className="border rounded w-full p-2 mt-1"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              <option value="">{t("select")}</option>
              {groups?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="joinDate">{t("join_date")}</Label>
            <Input
              id="joinDate"
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />}
              {t("create")}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
