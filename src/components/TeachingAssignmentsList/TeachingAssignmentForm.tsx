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

const DAYS_PATTERNS = [
  { value: "ADD", label: "Weekdays" },
  { value: "ODD", label: "Weekend" },
  { value: "ALL", label: "All days" },
];

export const TeachingAssignmentForm = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
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
        setError("Ma'lumotlarni olishda xato yuz berdi");
        setOpenAlert(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const teacherLabel = (t: any) =>
    t.name ||
    t.fullName ||
    `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim() ||
    t.id;

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
    const { teacherId, groupId } = form;
    if (!teacherId || !groupId) return;

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
      console.error("submit error", err);
      setError(err?.response?.data?.message ?? err.message ?? "Xato yuz berdi");
      setOpenAlert(true);
    }
  };

  if (loading)
    return (
      <div className="text-center py-6 text-gray-500">
        Ma'lumotlar yuklanmoqda...
      </div>
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
            O'qituvchi
          </label>
          <Select
            value={form.teacherId}
            onValueChange={(v) => updateForm("teacherId", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="O'qituvchi tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {teachers.length === 0 ? (
                  <SelectItem value="">— Hech qanday o'qituvchi —</SelectItem>
                ) : (
                  teachers.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {teacherLabel(t)}
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
            Guruh
          </label>
          <Select
            value={form.groupId}
            onValueChange={(v) => updateForm("groupId", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Guruh tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {groups.map((g: any) => (
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
            Role
          </label>
          <Select
            value={form.role}
            onValueChange={(v) => updateForm("role", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LEAD">LEAD</SelectItem>
              <SelectItem value="ASSISTANT">ASSISTANT</SelectItem>
              <SelectItem value="SUBSTITUTE">SUBSTITUTE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Period */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              From
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
              To
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
            Guruh jadvalini meros qilib olish
          </label>
        </div>

        {/* Overrides */}
        {!form.inheritSchedule && (
          <>
            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Days pattern
              </label>
              <Select
                value={form.daysPatternOverride}
                onValueChange={(v) => updateForm("daysPatternOverride", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Days pattern tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DAYS_PATTERNS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  Start time (HH:MM)
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
                  End time (HH:MM)
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
            Note
          </label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => updateForm("note", e.target.value)}
            placeholder="Qo'shimcha izoh"
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Add Assignment
        </Button>
      </form>

      {/* Alert */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xatolik</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              Yopish
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpenAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
