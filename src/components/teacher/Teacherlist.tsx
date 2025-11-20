"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import AddTeacherForm from "../form/addTeacher";
import UpdateTeacherForm from "../form/Updateteacher";
import type { Teacher } from "@/Store";

export default function TeacherList() {
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<{ items: Teacher[] }>("/teachers", {
        params: { page: 1, limit: 10 },
      });
      setTeachers(data.items || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("fetch_error"));
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTeachers();
  }, []);

  const openModal = (teacher: Teacher | null) => {
    setEditingTeacher(teacher);
    setModalOpen(true);
  };

  return (
    <div className="w-[98%] mx-auto bg-white dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("teachers_list")}</h2>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          onClick={() => openModal(null)}
        >
          <Plus className="w-4 h-4" /> {t("add_teacher")}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : teachers.length === 0 ? (
        <p className="text-gray-500 text-center">{t("no_teachers")}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left p-2">T/r</th>
              <th className="text-left p-2">{t("photo")}</th>
              <th className="text-left p-2">{t("full_name")}</th>
              <th className="text-left p-2">{t("phone")}</th>
              <th className="text-left p-2">{t("date_added")}</th>
              <th className="text-right p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <img
                    src={teacher.photoUrl || "/default-avatar.png"}
                    alt={teacher.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="p-2">
                  {teacher.fullName ||
                    `${teacher.firstName || ""} ${teacher.lastName || ""}`}
                </td>
                <td className="p-2">{teacher.phone}</td>
                <td className="p-2">
                  {new Date(teacher.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 text-right flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(teacher)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteTarget(teacher)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex justify-end z-50">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="bg-white dark:bg-gray-900 w-full sm:max-w-md h-full shadow-xl flex flex-col"
          >
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold dark:text-white">
                  {editingTeacher ? t("edit_teacher") : t("add_teacher")}
                </h2>
              </div>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                {t("close")}
              </Button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {editingTeacher ? (
                <UpdateTeacherForm
                  teacher={editingTeacher}
                  onSuccess={() => {
                    fetchTeachers();
                    setModalOpen(false);
                    setEditingTeacher(null);
                  }}
                />
              ) : (
                <AddTeacherForm
                  onSuccess={() => {
                    fetchTeachers();
                    setModalOpen(false);
                  }}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-lg space-y-4"
          >
            <h2 className="text-lg font-semibold dark:text-white">
              {t("delete_confirm_title") || "O‘chirishni tasdiqlang"}
            </h2>
            <p className="dark:text-gray-300">
              {t("delete_confirm_text") ||
                `"${deleteTarget.fullName}" o‘qituvchini o‘chirishni xohlaysizmi?`}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="dark:border-gray-600"
                onClick={() => setDeleteTarget(null)}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    setLoading(true);
                    await api.delete(`/teachers/${deleteTarget.id}`);
                    setTeachers((prev) =>
                      prev.filter((t) => t.id !== deleteTarget.id)
                    );
                    setDeleteTarget(null);
                  } catch (err: any) {
                    alert(
                      err?.response?.data?.message ||
                        err?.message ||
                        "O‘chirishda xatolik yuz berdi"
                    );
                    setDeleteTarget(null);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {t("delete") || "O‘chirish"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
