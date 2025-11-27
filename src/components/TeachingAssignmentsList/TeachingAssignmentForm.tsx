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
        setGroups(
          Array.isArray(groupRes.data.items) ? groupRes.data.items : []
        );
      } catch (err: any) {
        setError(t("error"));
        setOpenAlert(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const teacherLabel = (tch: any) =>
    tch.name ||
    tch.fullName ||
    `${tch.firstName ?? ""} ${tch.lastName ?? ""}`.trim() ||
    tch.id;

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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 bg-white dark:bg-black border dark:border-gray-700 rounded-xl shadow-md"
      >
        {/* Teacher */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("teacher")}
          </label>
          <Select
            value={form.teacherId}
            onValueChange={(v) => updateForm("teacherId", v)}
          >
            <SelectTrigger className="w-full">
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

        {/* Group */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("group")}
          </label>
          <Select
            value={form.groupId}
            onValueChange={(v) => updateForm("groupId", v)}
          >
            <SelectTrigger className="w-full">
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

        {/* Role */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("role")}
          </label>
          <Select
            value={form.role}
            onValueChange={(v) => updateForm("role", v)}
          >
            <SelectTrigger className="w-full">
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              {t("from")}
            </label>
            <input
              type="date"
              value={form.fromDate}
              onChange={(e) => updateForm("fromDate", e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
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
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
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
            className="w-4 h-4"
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
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                {t("days_pattern")}
              </label>
              <Select
                value={form.daysPatternOverride}
                onValueChange={(v) => updateForm("daysPatternOverride", v)}
              >
                <SelectTrigger className="w-full">
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

            <div className="grid grid-cols-2 gap-3">
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
                  className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
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
                  className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
          </>
        )}

        {/* Note */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("note")}
          </label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => updateForm("note", e.target.value)}
            placeholder={t("placeholder_note")}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {t("add_assignment")}
        </Button>
      </form>

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
