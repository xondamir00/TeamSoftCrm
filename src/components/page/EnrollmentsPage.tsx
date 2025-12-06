"use client";

import { useEffect, useState } from "react";
import {
  getStudents,
  getGroups,
  getEnrollments,
  createEnrollment,
} from "@/components/Enrollments/enrapi";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EnrollmentPage() {
  const { t } = useTranslation();

  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadAll = async () => {
    const s = await getStudents();
    const g = await getGroups();
    const e = await getEnrollments();

    setStudents(s.data.items ?? s.data);
    setGroups(g.data.items ?? g.data);
    setEnrollments(e.data.items ?? e.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const unassignedStudents = students
    .filter(
      (s) =>
        !enrollments.some((e) => e.studentId === s.id && e.status === "ACTIVE")
    )
    .filter((s) => s.fullName.toLowerCase().includes(search.toLowerCase()));

  const handleAssign = async (studentId: string) => {
    if (!selectedGroup) {
      alert(t("select_group_first"));
      return;
    }

    try {
      setLoadingId(studentId);

      await createEnrollment({
        studentId,
        groupId: selectedGroup,
      });

      await loadAll();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        {t("assign_students_to_group")}
      </h1>
      <div className="flex gap-2 w-full justify-between">
        <input
          type="text"
          placeholder={t("search_student")}
          className="border p-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-md"
          value={selectedGroup ?? ""}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">{t("select_group")}</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {unassignedStudents.length === 0 ? (
          <p className="text-gray-600">{t("no_students_found")}</p>
        ) : (
          unassignedStudents.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-4 bg-white shadow rounded-lg border"
            >
              <div>
                <p className="text-lg font-semibold">{s.fullName}</p>
                <p className="text-gray-500">{s.phone}</p>
              </div>
              <Button
                onClick={() => handleAssign(s.id)}
                disabled={loadingId === s.id}
              >
                {loadingId === s.id && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {t("assign")}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
