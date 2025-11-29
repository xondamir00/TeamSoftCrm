"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface Assignment {
  id: string;
  teacherId: string;
  groupId: string;
  role: string;
  isActive: boolean;
  note: string | null;
}

export const TeachingAssignmentsList = () => {
  const { t } = useTranslation();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/teaching-assignments");
      setAssignments(data.items || []);
    } catch (err: any) {
      setError(err.response?.data?.message || t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  if (!assignments.length)
    return (
      <p className="text-center text-gray-500 py-6">{t("no_assignments")}</p>
    );

  return (
    <div className="w-[95%] mx-auto dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold mb-4">
        {t("teaching_assignments")}
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>{t("teacher_id")}</TableHead>
              <TableHead>{t("group_id")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("note")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((a, i) => (
              <TableRow
                key={a.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>{a.teacherId}</TableCell>
                <TableCell>{a.groupId}</TableCell>
                <TableCell>{a.role}</TableCell>
                <TableCell>
                  <Badge variant={a.isActive ? "success" : "destructive"}>
                    {a.isActive ? t("active") : t("inactive")}
                  </Badge>
                </TableCell>
                <TableCell>{a.note ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
