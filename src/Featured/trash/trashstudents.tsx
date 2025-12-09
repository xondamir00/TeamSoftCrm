"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { trashStudentService } from "@/Service/TrashService";
import type { Student } from "@/Store/Student/StudentInterface";

export default function TrashStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await trashStudentService.getAll();
      setStudents(data.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const restoreStudent = async (id: string) => {
    await trashStudentService.restore(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="shadow-lg p-5 bg-white dark:bg-slate-900 backdrop-blur border border-red-200 dark:border-red-900/40 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-600 dark:text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            {t("trashStudentsTitle")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {loading && (
            <p className="text-center text-sm opacity-60 py-4 dark:text-gray-300">
              {t("loading")}
            </p>
          )}

          {!loading && students.length === 0 && (
            <p className="text-center text-sm opacity-60 py-4 dark:text-gray-300">
              {t("emptyText")}
            </p>
          )}

          <AnimatePresence>
            {students.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 40 }}
                transition={{ duration: 0.25 }}
                className="flex justify-between items-center p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 dark:border-red-900/40 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              >
                <div>
                  <p className="font-medium line-through text-red-700 dark:text-red-400">
                    {s.fullName}
                  </p>
                  <p className="text-xs opacity-60 dark:text-gray-300">
                    {t("phone")}: {s.phone || "—"}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 border-red-400 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40"
                  onClick={() => restoreStudent(s.id)}
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("restore")}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
