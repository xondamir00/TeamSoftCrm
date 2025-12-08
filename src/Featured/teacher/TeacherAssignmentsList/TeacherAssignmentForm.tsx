"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useTeachingAssignmentStore from "@/Service/TeacherAssigmentService";
import type { TeachingAssignmentFormProps } from "@/Store/Teacher/TeacherInterface";
import { DAYS_PATTERNS } from "@/constants";



export const TeachingAssignmentForm = ({
  onSuccess,
}: TeachingAssignmentFormProps) => {
  const { t } = useTranslation();
  
  // Store'dan state va metodlarni olamiz
  const {
    teachers,
    groups,
    formLoading: loading,
    error,
    fetchFormData,
    createAssignment,
    setError
  } = useTeachingAssignmentStore();

  const [form, setForm] = useState({
    teacherId: "",
    groupId: "",
    role: "LEAD",
    note: "",
    fromDate: "",
    toDate: "",
    inheritSchedule: true,
    daysPatternOverride: "",
    startTimeOverride: "",
    endTimeOverride: "",
  });

  const [openAlert, setOpenAlert] = useState(false);

  // Form input'larini yangilash
  const updateForm = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Teacher va group ma'lumotlarini yuklash
  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  // Teacher nomini formatlash
  const teacherLabel = (tch: any) =>
    tch.name ||
    tch.fullName ||
    `${tch.firstName ?? ""} ${tch.lastName ?? ""}`.trim() ||
    tch.id;

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.teacherId || !form.groupId) {
      setError(t("select_teacher_and_group") || "Please select teacher and group");
      setOpenAlert(true);
      return;
    }

    try {
      // Payload tayyorlash
      const payload = {
        teacherId: form.teacherId,
        groupId: form.groupId,
        role: form.role,
        note: form.note || undefined,
        fromDate: form.fromDate || undefined,
        toDate: form.toDate || undefined,
        inheritSchedule: form.inheritSchedule,
        daysPatternOverride: form.inheritSchedule ? undefined : form.daysPatternOverride,
        startTimeOverride: form.inheritSchedule ? undefined : form.startTimeOverride,
        endTimeOverride: form.inheritSchedule ? undefined : form.endTimeOverride,
      };

      // Store orqali assignment yaratish
      await createAssignment(payload);
      
      // Muvaffaqiyatli bo'lsa
      onSuccess();
      
      // Formni tozalash
      setForm({
        teacherId: "",
        groupId: "",
        role: "LEAD",
        note: "",
        fromDate: "",
        toDate: "",
        inheritSchedule: true,
        daysPatternOverride: "",
        startTimeOverride: "",
        endTimeOverride: "",
      });
      
    } catch (err: any) {
      // Xatolikni ko'rsatish
      setError(err?.response?.data?.message ?? t("error") ?? "An error occurred");
      setOpenAlert(true);
    }
  };

  // Yuklanish holati
  if (loading)
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        {t("loading_data") || "Loading..."}
      </div>
    );

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-5 p-6 mt-7 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-900 max-w-3xl mx-auto"
      >
        {/* Teacher va Group selector'lar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Teacher selector */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("teacher") || "Teacher"}
            </label>
            <Select
              value={form.teacherId}
              onValueChange={(v) => updateForm("teacherId", v)}
            >
              <SelectTrigger className="w-full border rounded-lg dark:bg-slate-900 dark:border-gray-700">
                <SelectValue placeholder={t("select_teacher") || "Select teacher"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {teachers.length === 0 ? (
                    <SelectItem value="" disabled>
                      {t("no_teacher") || "No teachers available"}
                    </SelectItem>
                  ) : (
                    teachers.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {teacherLabel(item)}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Group selector */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("group") || "Group"}
            </label>
            <Select
              value={form.groupId}
              onValueChange={(v) => updateForm("groupId", v)}
            >
              <SelectTrigger className="w-full border rounded-lg dark:bg-slate-900 dark:border-gray-700">
                <SelectValue placeholder={t("select_group") || "Select group"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {groups.length === 0 ? (
                    <SelectItem value="" disabled>
                      {t("no_group") || "No groups available"}
                    </SelectItem>
                  ) : (
                    groups.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name ?? g.title ?? g.id}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Role selector */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("role") || "Role"}
          </label>
          <Select
            value={form.role}
            onValueChange={(v) => updateForm("role", v)}
          >
            <SelectTrigger className="w-full border rounded-lg dark:bg-slate-900 dark:border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LEAD">{t("lead") || "Lead"}</SelectItem>
              <SelectItem value="ASSISTANT">{t("assistant") || "Assistant"}</SelectItem>
              <SelectItem value="SUBSTITUTE">{t("substitute") || "Substitute"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              {t("from") || "From"}
            </label>
            <input
              type="date"
              value={form.fromDate}
              onChange={(e) => updateForm("fromDate", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              {t("to") || "To"}
            </label>
            <input
              type="date"
              value={form.toDate}
              onChange={(e) => updateForm("toDate", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Inherit schedule checkbox */}
        <div className="flex items-center gap-3">
          <input
            id="inherit"
            type="checkbox"
            checked={form.inheritSchedule}
            onChange={(e) => updateForm("inheritSchedule", e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 dark:bg-slate-900"
          />
          <label
            htmlFor="inherit"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {t("inherit_schedule") || "Inherit group schedule"}
          </label>
        </div>

        {/* Custom schedule (if not inheriting) */}
        {!form.inheritSchedule && (
          <>
            <div>
              <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                {t("days_pattern") || "Days Pattern"}
              </label>
              <Select
                value={form.daysPatternOverride}
                onValueChange={(v) => updateForm("daysPatternOverride", v)}
              >
                <SelectTrigger className="w-full border rounded-lg dark:bg-slate-900 dark:border-gray-700">
                  <SelectValue placeholder={t("select_days_pattern") || "Select days pattern"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DAYS_PATTERNS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {t(d.labelKey) || d.value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  {t("start_time") || "Start Time"}
                </label>
                <input
                  type="time"
                  value={form.startTimeOverride}
                  onChange={(e) => updateForm("startTimeOverride", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  {t("end_time") || "End Time"}
                </label>
                <input
                  type="time"
                  value={form.endTimeOverride}
                  onChange={(e) => updateForm("endTimeOverride", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          </>
        )}

        {/* Note input */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("note") || "Note (Optional)"}
          </label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => updateForm("note", e.target.value)}
            placeholder={t("placeholder_note") || "Add a note..."}
            className="w-full border rounded-lg px-3 py-2 dark:bg-slate-900 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={!form.teacherId || !form.groupId}
          className="bg-[#0208B0] hover:bg-[#0208B0] text-white rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("add_assignment") || "Add Assignment"}
        </Button>
      </motion.form>

      {/* Error alert dialog */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("error") || "Error"}</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              {t("close") || "Close"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpenAlert(false)}>
              {t("ok") || "OK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};