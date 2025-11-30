"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
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

const DAYS_PATTERNS = [
  { value: "ADD", labelKey: "weekdays" },
  { value: "ODD", labelKey: "weekend" },
  { value: "ALL", labelKey: "all_days" },
];

interface TeachingAssignmentFormProps {
  onSuccess: () => void;
}

export const TeachingAssignmentForm = ({
  onSuccess,
}: TeachingAssignmentFormProps) => {
  const { t } = useTranslation();

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

  const [teachers, setTeachers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [error, setError] = useState("");

  const updateForm = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [teacherRes, groupRes] = await Promise.all([
          api.get("/teachers"),
          api.get("/groups"),
        ]);
        setTeachers(
          Array.isArray(teacherRes.data.items) ? teacherRes.data.items : []
        );
        setGroups(Array.isArray(groupRes.data.items) ? groupRes.data.items : []);
      } catch (err: any) {
        setError(t("error"));
        setOpenAlert(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const teacherLabel = (tch: any) =>
    tch.name || tch.fullName || `${tch.firstName ?? ""} ${tch.lastName ?? ""}`.trim() || tch.id;

  const buildDto = () => {
    const dto: any = {
      teacherId: form.teacherId,
      groupId: form.groupId,
      role: form.role,
      note: form.note || undefined,
      inheritSchedule: !!form.inheritSchedule,
    };
    if (form.fromDate) dto.fromDate = new Date(form.fromDate).toISOString();
    if (form.toDate) dto.toDate = new Date(form.toDate).toISOString();
    if (!form.inheritSchedule) {
      dto.daysPatternOverride = form.daysPatternOverride || undefined;
      dto.startTimeOverride = form.startTimeOverride || undefined;
      dto.endTimeOverride = form.endTimeOverride || undefined;
    }
    return dto;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.teacherId || !form.groupId) return;
    try {
      await api.post("/teaching-assignments", buildDto());
      onSuccess();
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
      setError(err?.response?.data?.message ?? t("error"));
      setOpenAlert(true);
    }
  };

  if (loading)
    return (
      <div className="text-center py-6 text-gray-500">{t("loading_data")}</div>
    );

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-5 p-6 mt-7 bg-white dark:bg-black rounded-3xl shadow-xl border border-gray-200 dark:border-gray-900 max-w-3xl mx-auto"
      >
        {/* Teacher & Group (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("teacher")}
            </label>
            <Select
              value={form.teacherId}
              onValueChange={(v) => updateForm("teacherId", v)}
            >
              <SelectTrigger className="w-full border rounded-lg dark:bg-black dark:border-gray-700">
                <SelectValue placeholder={t("select_teacher")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {teachers.length === 0 ? (
                    <SelectItem value="">{t("no_teacher")}</SelectItem>
                  ) : (
                    teachers.map((tch) => (
                      <SelectItem key={tch.id} value={tch.id}>
                        {teacherLabel(tch)}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("group")}
            </label>
            <Select
              value={form.groupId}
              onValueChange={(v) => updateForm("groupId", v)}
            >
              <SelectTrigger className="w-full border rounded-lg dark:bg-black dark:border-gray-700">
                <SelectValue placeholder={t("select_group")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name ?? g.title ?? g.id}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("role")}
          </label>
          <Select
            value={form.role}
            onValueChange={(v) => updateForm("role", v)}
          >
            <SelectTrigger className="w-full border rounded-lg dark:bg-black dark:border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LEAD">{t("lead")}</SelectItem>
              <SelectItem value="ASSISTANT">{t("assistant")}</SelectItem>
              <SelectItem value="SUBSTITUTE">{t("substitute")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              {t("from")}
            </label>
            <input
              type="date"
              value={form.fromDate}
              onChange={(e) => updateForm("fromDate", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-black dark:border-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              {t("to")}
            </label>
            <input
              type="date"
              value={form.toDate}
              onChange={(e) => updateForm("toDate", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-black dark:border-gray-700"
            />
          </div>
        </div>

        {/* Inherit toggle */}
        <div className="flex items-center gap-3">
          <input
            id="inherit"
            type="checkbox"
            checked={form.inheritSchedule}
            onChange={(e) => updateForm("inheritSchedule", e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 dark:bg-black"
          />
          <label
            htmlFor="inherit"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {t("inherit_schedule")}
          </label>
        </div>

        {/* Overrides */}
        {!form.inheritSchedule && (
          <>
            <div>
              <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                {t("days_pattern")}
              </label>
              <Select
                value={form.daysPatternOverride}
                onValueChange={(v) => updateForm("daysPatternOverride", v)}
              >
                <SelectTrigger className="w-full border rounded-lg dark:bg-black dark:border-gray-700">
                  <SelectValue placeholder={t("select_days_pattern")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DAYS_PATTERNS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {t(d.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  {t("start_time")}
                </label>
                <input
                  type="time"
                  value={form.startTimeOverride}
                  onChange={(e) =>
                    updateForm("startTimeOverride", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2 dark:bg-black dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  {t("end_time")}
                </label>
                <input
                  type="time"
                  value={form.endTimeOverride}
                  onChange={(e) =>
                    updateForm("endTimeOverride", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2 dark:bg-black dark:border-gray-700"
                />
              </div>
            </div>
          </>
        )}

        {/* Note */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("note")}
          </label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => updateForm("note", e.target.value)}
            placeholder={t("placeholder_note")}
            className="w-full border rounded-lg px-3 py-2 dark:bg-black dark:border-gray-700"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="bg-[#0208B0] hover:bg-[#0208B0] text-white rounded-lg shadow-lg transition-all duration-200"
        >
          {t("add_assignment")}
        </Button>
      </motion.form>

      {/* Alert */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("error")}</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              {t("close")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpenAlert(false)}>
              {t("ok")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
