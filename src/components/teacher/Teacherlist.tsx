"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import AddTeacherForm from "../form/addTeacher";
import UpdateTeacherForm from "../form/Updateteacher";
import DeleteTeacherDialog from "../form/DeleteTeacherDialog"; // 🔹 yangi qo‘shilgan
import type { Teacher } from "@/Store";

export default function TeacherList() {
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/teachers", {
        params: { page: 1, limit: 10 },
      });
      setTeachers(data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="w-[98%] mx-auto bg-white dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-4 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("teachers_list")}</h2>

        {/* Add Teacher */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex bg-blue-500 text-white items-center gap-2"
            >
              <Plus size={16} />
              {t("add_teacher")}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-[500px] p-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-black overflow-y-auto"
          >
            <SheetHeader className="p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-black">
              <SheetTitle>{t("add_teacher")}</SheetTitle>
            </SheetHeader>

            <div className="p-4">
              <AddTeacherForm onSuccess={fetchTeachers} />
            </div>

            <div className="flex justify-end p-3 border-t dark:border-gray-700">
              <SheetClose asChild>
                <Button variant="outline">{t("close")}</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
        <Table>
          <TableCaption className="hidden mt-0 text-lg dark:text-gray-300">
            {t("teachers_list")}
          </TableCaption>

          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead>T/r</TableHead>
              <TableHead>{t("photo")}</TableHead>
              <TableHead>{t("full_name")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("date_added")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-4"
                >
                  {t("no_teachers")}
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher, index) => (
                <TableRow
                  key={teacher.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <img
                      src={teacher.photoUrl || "/default-avatar.png"}
                      alt={teacher.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>

                  <TableCell>
                    {teacher.fullName ||
                      `${teacher.firstName || ""} ${teacher.lastName || ""}`}
                  </TableCell>

                  <TableCell>{teacher.phone}</TableCell>

                  <TableCell>
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right flex justify-end gap-2">
                    {/* Update */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTeacher(teacher)}
                        >
                          <Pencil size={15} />
                        </Button>
                      </SheetTrigger>

                      <SheetContent
                        side="right"
                        className="w-full sm:max-w-[500px] p-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-black overflow-y-auto"
                      >
                        <SheetHeader className="p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-black">
                          <SheetTitle>{t("edit_teacher")}</SheetTitle>
                        </SheetHeader>

                        <div className="p-4">
                          {selectedTeacher && (
                            <UpdateTeacherForm
                              teacher={selectedTeacher}
                              onSuccess={() => {
                                fetchTeachers();
                                setSelectedTeacher(null);
                              }}
                            />
                          )}
                        </div>

                        <div className="flex justify-end p-3 border-t dark:border-gray-700">
                          <SheetClose asChild>
                            <Button variant="outline">{t("close")}</Button>
                          </SheetClose>
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* Delete */}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setTeacherToDelete(teacher);
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <DeleteTeacherDialog
        teacher={teacherToDelete}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={fetchTeachers}
      />
    </div>
  );
}
