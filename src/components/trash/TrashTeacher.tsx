"use client";

import { useEffect, useState } from "react";
import { Loader2, RotateCcw, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeleteTeacherDialog from "../../Featured/teacher/DeleteTeacher";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Teacher } from "@/Store/Teacher/TeacherInterface";
import { trashTeacherService } from "@/Service/TrashService";

export default function TrashTeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const { t } = useTranslation();

  // Type-safe error parser
  const parseError = (err: unknown): string => {
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response?: { data?: { message?: string } } }).response
        ?.data?.message === "string"
    ) {
      return (err as { response: { data: { message: string } } }).response.data
        .message;
    }
    return t("errorDefault");
  };

  const fetchTrashTeachers = async () => {
    try {
      setLoading(true);
      const data = await trashTeacherService.getAll(); // data: { items: Teacher[] }
      setTeachers(data.items ?? []);
    } catch (err: unknown) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashTeachers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg p-5 bg-white dark:bg-slate-900 backdrop-blur border border-red-200 dark:border-red-900/40 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-600 dark:text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            {t("trashTeachersTitle")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {loading && (
            <div className="py-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500 dark:text-gray-300" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && teachers.length === 0 && (
            <p className="text-center text-sm opacity-60 py-4 dark:text-gray-300">
              {t("emptyText")}
            </p>
          )}

          <AnimatePresence>
            {teachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 40 }}
                transition={{ duration: 0.25 }}
                className="flex justify-between items-center p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 dark:border-red-900/40 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              >
                <div>
                  <p className="font-medium line-through text-red-700 dark:text-red-400">
                    {teacher.fullName}
                  </p>
                  <p className="text-xs opacity-60 dark:text-gray-300">
                    {teacher.phone}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 border-red-400 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40"
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setRestoreOpen(true);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("restore")}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      <DeleteTeacherDialog
        teacher={selectedTeacher}
        open={restoreOpen}
        onClose={() => setRestoreOpen(false)}
        onDeleted={fetchTrashTeachers}
      />
    </div>
  );
}
