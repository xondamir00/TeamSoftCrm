"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import AddOrEditStudentForm from "./EditStudent";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}

export default function StudentsList() {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/students");
      setStudents(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("delete_confirm") || "Are you sure?")) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="w-[98%] mx-auto bg-white dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("students_list")}</h2>

        {/* O‘ngdan chiqadigan Sheet tugmasi */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
              onClick={() => {
                setSelectedStudent(null);
                setSheetOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> {t("add_student")}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-md p-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto"
          >
            <SheetHeader className="p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <SheetTitle>
                {selectedStudent ? t("edit_student") : t("add_student")}
              </SheetTitle>
              <SheetDescription>
                {selectedStudent
                  ? t("edit_student_description")
                  : t("add_student_description")}
              </SheetDescription>
            </SheetHeader>

            <div className="p-4 flex-1">
              <AddOrEditStudentForm
                student={selectedStudent}
                onSuccess={() => {
                  setSheetOpen(false);
                  fetchStudents();
                }}
                onCancel={() => setSheetOpen(false)}
              />
            </div>

            <div className="flex justify-end p-3 border-t dark:border-gray-700">
              <SheetClose asChild>
                <Button variant="outline">{t("close")}</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500 text-center">{t("no_students")}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left p-2">{t("first_name")}</th>
              <th className="text-left p-2">{t("last_name")}</th>
              <th className="text-left p-2">{t("phone")}</th>
              <th className="text-right p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr
                key={s.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-2">{s.firstName}</td>
                <td className="p-2">{s.lastName}</td>
                <td className="p-2">{s.phone}</td>
                <td className="p-2 text-right flex justify-end gap-2">
                  {/* Edit student */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedStudent(s);
                      setSheetOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* Delete student */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(s.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
