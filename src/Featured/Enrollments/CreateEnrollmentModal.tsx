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
import { useEnrollmentStore } from "@/Service/EnrollmentService/EnrollmentService";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateEnrollmentDrawer({ onClose, onSuccess }: Props) {
  const { t } = useTranslation();

  const [localStudents, setLocalStudents] = useState<any[]>([]);
  const [localGroups, setLocalGroups] = useState<any[]>([]);
  const [studentId, setStudentId] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [joinDate, setJoinDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Store'dan ma'lumotlarni olish
  const { 
    students: storeStudents, 
    groups: storeGroups, 
    fetchStudents, 
    fetchGroups, 
    createEnrollment 
  } = useEnrollmentStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchStudents(), fetchGroups()]);
        setError(null);
      } catch {
        setError(t("fetch_error"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchStudents, fetchGroups, t]);

  useEffect(() => {
    setLocalStudents(storeStudents || []);
    setLocalGroups(storeGroups || []);
  }, [storeStudents, storeGroups]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId || !groupId) {
      setError(t("select_student_group") || "Talaba va guruhni tanlang");
      return;
    }
    
    setLoading(true);
    try {
      const enrollmentData: any = {
        studentId: studentId,
        groupId: groupId,
      };
      
      if (joinDate && joinDate.trim()) {
        enrollmentData.joinDate = joinDate;
      }
      
      await createEnrollment(enrollmentData);
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      setError(err.response?.data?.message || t("server_error") || "Server xatosi");
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
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full max-w-md p-6 shadow-xl relative h-full overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">{t("create_enrollment") || "Yangi qo'shilish yaratish"}</h2>

        {error && (
          <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("error_occurred") || "Xatolik yuz berdi"}</AlertDialogTitle>
                <AlertDialogDescription>{error}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setError(null)}>
                  {t("close") || "Yopish"}
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">{t("student") || "Talaba"}</Label>
            <select
              id="student"
              className="border rounded w-full p-2 mt-1"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">{t("select") || "Tanlash"}</option>
              {localStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="group">{t("group") || "Guruh"}</Label>
            <select
              id="group"
              className="border rounded w-full p-2 mt-1"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">{t("select") || "Tanlash"}</option>
              {localGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="joinDate">{t("join_date") || "Qo'shilish sanasi"}</Label>
            <Input
              id="joinDate"
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              type="button"
              disabled={loading}
            >
              {t("cancel") || "Bekor qilish"}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />}
              {t("create") || "Yaratish"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}