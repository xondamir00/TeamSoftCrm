"use client";

import { useEffect, useState } from "react";
import {
  getStudents,
  getGroups,
  getEnrollments,
  createEnrollment,
} from "@/Service/EnrollmentService/EnrollmentService";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950 transition-all">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center drop-shadow-sm">
          {t("assign_students_to_group")}
        </h1>
        <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 shadow-xl border border-white/30 dark:border-slate-700/40">
          <CardContent className="p-6 flex flex-col md:flex-row gap-4 justify-between">
            <Input
              placeholder={t("search_student")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/70 dark:bg-slate-700/70 backdrop-blur rounded-md"
            />

            <Select
              onValueChange={(v) => setSelectedGroup(v)}
              value={selectedGroup ?? ""}
            >
              <SelectTrigger className="bg-white/70 dark:bg-slate-700/70 backdrop-blur rounded-md">
                <SelectValue placeholder={t("select_group")} />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {unassignedStudents.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
              {t("no_students_found")}
            </p>
          ) : (
            unassignedStudents.map((s) => (
              <Card
                key={s.id}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all"
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {s.fullName}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {s.phone}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleAssign(s.id)}
                    disabled={loadingId === s.id}
                    className="px-6 bg-blue-600 hover:bg-blue-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700"
                  >
                    {loadingId === s.id && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {t("assign")}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
