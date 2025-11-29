"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { Teacher } from "@/Store";
import UpdateTeacherForm from "./UpdateTeacherForm";
import AddTeacherForm from "./AddTeacherForm";
import { Input } from "@/components/ui/input";
import DeleteTeacherDialog from "./deleteTeacher";

export default function TeacherList() {
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const [search, setSearch] = useState("");

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<{ items: Teacher[] }>("/teachers", {
        params: { page: 1, limit: 50, search },
      });
      console.log(data);

      setTeachers((data.items || []).filter((t) => t.isActive)); 
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
  }, [search]);

  const openModal = (teacher: Teacher | null) => {
    setEditingTeacher(teacher);
    setModalOpen(true);
  };

  const handleDeleted = () => {
    fetchTeachers();
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 w-[98%] mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          placeholder={t("search_teacher") || "Search teachers..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md dark:bg-gray-800 dark:text-gray-200"
        />

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          onClick={() => openModal(null)}
        >
          <Plus className="w-4 h-4" /> {t("add_teacher")}
        </Button>
      </div>

      {/* Table Container */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm dark:shadow-black/30">
        {loading ? (
          <div className="py-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center p-4">{error}</p>
        ) : teachers.length === 0 ? (
          <p className="text-gray-500 text-center p-6">{t("no_teachers")}</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">{t("photo")}</th>
                <th className="p-3 text-left">{t("full_name")}</th>
                <th className="p-3 text-left">{t("phone")}</th>
                <th className="p-3 text-left">{t("date_added")}</th>
                <th className="p-3 text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr
                  key={teacher.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <img
                      src={teacher.photoUrl || "/default-avatar.png"}
                      alt="teacher"
                      className="w-10 h-10 rounded-full object-cover shadow-sm"
                    />
                  </td>
                  <td className="p-3">
                    {teacher.fullName ||
                      `${teacher.firstName} ${teacher.lastName}`}
                  </td>
                  <td className="p-3">{teacher.phone}</td>
                  <td className="p-3">
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => openModal(teacher)}
                      className="dark:border-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
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
      </div>

      {/* Add/Edit Drawer */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 w-full sm:max-w-md h-full shadow-xl flex flex-col"
          >
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold dark:text-white">
                {editingTeacher ? t("edit_teacher") : t("add_teacher")}
              </h2>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                {t("close")}
              </Button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
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

      {/* Delete Dialog */}
      <DeleteTeacherDialog
        teacher={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
