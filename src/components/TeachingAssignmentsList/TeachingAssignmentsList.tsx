"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

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
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400 dark:text-gray-500" />
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive" className="my-4 shadow-lg">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );

  if (!assignments.length)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
        {t("no_assignments")}
      </p>
    );

  const rowVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6  text-gray-900 dark:text-gray-100">
        {t("teaching_assignments")}
      </h2>
      <div className="hidden md:block overflow-x-auto rounded-2xl shadow-lg border border-gray-200  dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-900">
            <tr className="">
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t("teacher_id")}</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t("group_id")}</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t("role")}</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-green-500 dark:text-green-500">{t("status")}</th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t("note")}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
            {assignments.map((a, i) => (
              <motion.tr
                key={a.id}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer even:bg-gray-50 dark:even:bg-gray-900"
              >
                <td className="px-5 py-3 text-gray-700 dark:text-gray-200 font-medium">{i + 1}</td>
                <td className="px-5 py-3 text-gray-800 dark:text-gray-200">{a.teacherId}</td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{a.groupId}</td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-200 capitalize">{a.role}</td>
                <td className="px-5 py-3">
                  <Badge variant={a.isActive ? "success" : "destructive"} className="px-3 py-1 text-sm">
                    {a.isActive ? t("active") : t("inactive")}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{a.note ?? "—"}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col gap-4">
        {assignments.map((a, i) => (
          <motion.div
            key={a.id}
            initial="hidden"
            animate="visible"
            variants={rowVariants}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-4 flex flex-col gap-2 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800 dark:text-gray-200">{a.teacherId}</span>
              <Badge variant={a.isActive ? "success" : "destructive"}>{a.isActive ? t("active") : t("inactive")}</Badge>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">{t("group_id")}: {a.groupId}</p>
            <p className="text-gray-700 dark:text-gray-200 capitalize">{t("role")}: {a.role}</p>
            <p className="text-gray-600 dark:text-gray-400">{t("note")}: {a.note ?? "—"}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
