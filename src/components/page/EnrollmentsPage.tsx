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

export default function EnrollmentPage() {
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

  // ACTIVE enrollment bo‘lmagan studentlar
  const unassignedStudents = students
    .filter(
      (s) =>
        !enrollments.some((e) => e.studentId === s.id && e.status === "ACTIVE")
    )
    .filter((s) => s.fullName.toLowerCase().includes(search.toLowerCase()));

  const handleAssign = async (studentId: string) => {
    if (!selectedGroup) {
      alert("Avval guruh tanlang!");
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
        Studentlarni guruhga biriktirish
      </h1>

      {/* Search + Group Dropdown (yonma-yon) */}
      <div className="flex gap-2 w-full justify-between ">
        <input
          type="text"
          placeholder="Student qidirish..."
          className="border p-2 rounded-md "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-md"
          value={selectedGroup ?? ""}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">Guruh tanlang</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Studentlar listi */}
      <div className="space-y-4">
        {unassignedStudents.length === 0 ? (
          <p className="text-gray-600">
            Hech narsa topilmadi yoki hammasi biriktirilgan 👌
          </p>
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
                Biriktirish
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
