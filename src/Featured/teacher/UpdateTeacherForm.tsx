import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { X, Loader2 } from "lucide-react";
import type { AddTeacherDrawerProps } from "@/Store/Teacher/TeacherInterface";
import useTeacherStore from "@/Service/TeacherService";


export default function UpdateTeacherDrawer({
  open,
  onClose,
  teacherId,
  onUpdated,
}: AddTeacherDrawerProps) {
  const { t } = useTranslation();
  const { updateTeacher, fetchTeachers, selectedTeacher, setSelectedTeacher } = useTeacherStore();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    photoUrl: "",
    monthlySalary: null as number | null,
    percentShare: null as number | null,
  });

  useEffect(() => {
    if (!open || !teacherId) return;

    const fetchTeacher = async () => {
      try {
        setFetching(true);
        setError("");
        
        // Agar selectedTeacher bo'sh bo'lsa, store'dan teachers ro'yxatidan topamiz
        const { teachers } = useTeacherStore.getState();
        const teacher = selectedTeacher || teachers.find(t => t.id === teacherId);
        
        if (teacher) {
          setForm({
            firstName: teacher.firstName || "",
            lastName: teacher.lastName || "",
            phone: teacher.phone || "",
            password: "",
            photoUrl: teacher.photoUrl || "",
            monthlySalary: teacher.monthlySalary || null,
            percentShare: teacher.percentShare || null,
          });
        } else {
          setError(t("updateTeacher.error") || "Teacher not found");
        }
      } catch (err) {
        console.error("Error fetching teacher:", err);
        setError(
          t("updateTeacher.error") || t("error") || "Error loading teacher data"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchTeacher();
  }, [open, teacherId, t, selectedTeacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "monthlySalary" || name === "percentShare") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? null : parseFloat(value),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      if (!teacherId) {
        setError("Teacher ID is required");
        setLoading(false);
        return;
      }

      const payload: any = {};

      if (form.firstName) payload.firstName = form.firstName;
      if (form.lastName) payload.lastName = form.lastName;
      if (form.phone) payload.phone = form.phone;
      if (form.password) payload.password = form.password;

      payload.photoUrl =
        form.photoUrl && form.photoUrl.startsWith("http")
          ? form.photoUrl
          : null;
      payload.monthlySalary = form.monthlySalary;
      payload.percentShare = form.percentShare;

      if (payload.monthlySalary && payload.percentShare) {
        setError(
          t("updateTeacher.salaryWarning") ||
            "Cannot set both salary and percent share"
        );
        setLoading(false);
        return;
      }

      // Store orqali teacher'ni yangilaymiz
      await updateTeacher(teacherId, payload);

      // Teacherlar ro'yxatini yangilaymiz
      await fetchTeachers();

      setSuccess(true);

      setTimeout(() => {
        onUpdated();
        onClose();
        setSuccess(false);
        
        // Formni tozalash
        setForm({
          firstName: "",
          lastName: "",
          phone: "",
          password: "",
          photoUrl: "",
          monthlySalary: null,
          percentShare: null,
        });
        
        // SelectedTeacher ni null qilish
        setSelectedTeacher(null);
      }, 1500);
    } catch (err) {
      console.error("Error updating teacher:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred while updating teacher"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t("updateTeacher.title") || "Edit Teacher"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={loading}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {fetching ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {t("updateTeacher.loadingTeacher") || "Loading teacher data..."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg text-sm">
                  {t("updateTeacher.success") ||
                    "Teacher updated successfully!"}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t("updateTeacher.firstName") || "First Name"}
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder={
                    t("updateTeacher.placeholder.firstName") || "First name"
                  }
                  disabled={loading}
                  className="dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t("updateTeacher.lastName") || "Last Name"}
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder={
                    t("updateTeacher.placeholder.lastName") || "Last name"
                  }
                  disabled={loading}
                  className="dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t("updateTeacher.phone") || "Phone"}
                </label>
                <Input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={
                    t("updateTeacher.placeholder.phone") || "Phone number"
                  }
                  disabled={loading}
                  className="dark:bg-slate-800 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t("updateTeacher.password") ||
                    "Password (leave empty to keep current)"}
                </label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    t("updateTeacher.placeholder.password") || "New password"
                  }
                  disabled={loading}
                  className="dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t("updateTeacher.photoUrl") || "Photo URL"}
                </label>
                <Input
                  type="text"
                  name="photoUrl"
                  value={form.photoUrl}
                  onChange={handleChange}
                  placeholder={
                    t("updateTeacher.placeholder.photoUrl") ||
                    "https://example.com/photo.jpg"
                  }
                  disabled={loading}
                  className="dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t("updateTeacher.monthlySalary") || "Monthly Salary"}
                </label>
                <Input
                  type="number"
                  name="monthlySalary"
                  value={form.monthlySalary ?? ""}
                  onChange={handleChange}
                  placeholder={t("updateTeacher.placeholder.salary") || "0"}
                  disabled={loading}
                  className="dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t("updateTeacher.percentShare") || "Percent Share"}
                </label>
                <Input
                  type="number"
                  name="percentShare"
                  value={form.percentShare ?? ""}
                  onChange={handleChange}
                  placeholder={t("updateTeacher.placeholder.percent") || "0"}
                  disabled={loading}
                  className="dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
                {t("updateTeacher.note") ||
                  "Note: Set either monthly salary or percent share, not both."}
              </div>
            </form>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading || fetching}
            className="flex-1 dark:border-slate-700"
          >
            {t("updateTeacher.cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || fetching}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading
              ? t("updateTeacher.saving") || "Saving..."
              : t("updateTeacher.saveChanges") || "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}