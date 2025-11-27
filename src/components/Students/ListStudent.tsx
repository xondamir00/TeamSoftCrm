"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader2, Pencil, Trash2, RotateCw, Plus } from "lucide-react";
import DeleteStudentDialog from "./DeleteStudent";
import RestoreStudentDialog from "./RestoreStudent";
import AddStudentDrawer from "./AddStudentDrawer";
import EditStudentDrawer from "./EditStudentDrawer";
import type { Student } from "@/Store";
import { useTranslation } from "react-i18next";

const ListStudent = () => {
  const { t } = useTranslation();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students", {
        params: { search: debouncedSearch, page, limit, isActive: true },
      });

      setStudents(res.data.items || []);
      setTotalPages(res.data.meta?.pages || 1);
    } catch (err: any) {
      console.error(err);
      setError(t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [debouncedSearch, page]);

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleRestore = (student: Student) => {
    setSelectedStudent(student);
    setRestoreDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setOpenEditDrawer(true);
  };

  const handleUpdated = () => {
    fetchStudents();
    setDeleteDialogOpen(false);
    setRestoreDialogOpen(false);
    setOpenEditDrawer(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-400 dark:text-gray-500">
        <Loader2 className="animate-spin mr-2 w-6 h-6" />{" "}
        {t("loading_students")}
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 dark:text-red-400 p-4 rounded-md bg-red-50 dark:bg-red-900">
        {error}
      </div>
    );

  return (
    <div className="space-y-6 w-[98%] mx-auto ">
      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          type="text"
          placeholder={t("search_placeholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full dark:bg-gray-800 dark:text-gray-200"
        />
        <Button
          onClick={() => setOpenAddDrawer(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" /> {t("add_student")}
        </Button>
        <AddStudentDrawer
          open={openAddDrawer}
          onClose={() => setOpenAddDrawer(false)}
          onAdded={handleUpdated}
        />
      </div>

      {/* Students Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm dark:shadow-black/30">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-900">
            <TableRow>
              <TableHead className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">
                {t("id")}
              </TableHead>
              <TableHead className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">
                {t("name")}
              </TableHead>
              <TableHead className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">
                {t("phone")}
              </TableHead>
              <TableHead className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">
                {t("status")}
              </TableHead>
              <TableHead className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">
                {t("dob")}
              </TableHead>
              <TableHead className="text-left px-4 py-2 text-gray-700 dark:text-gray-300">
                {t("start_date")}
              </TableHead>
              <TableHead className="text-right px-4 py-2 text-gray-700 dark:text-gray-300">
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 dark:text-gray-400 py-4"
                >
                  {t("no_students")}
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="font-mono text-sm px-4 py-2">
                    {student.id}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {student.fullName}
                  </TableCell>
                  <TableCell className="px-4 py-2">{student.phone}</TableCell>
                  <TableCell className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {student.isActive ? t("active") : t("inactive")}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {student.dateOfBirth || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {student.startDate || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(student)}
                      className="dark:border-gray-600 dark:text-gray-200"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {student.isActive ? (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(student)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleRestore(student)}
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          {t("previous")}
        </Button>

        <span className="text-gray-600 dark:text-gray-300">
          {t("page")} <strong>{page}</strong> {t("of")} {totalPages}
        </span>

        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          {t("next")}
        </Button>
      </div>

      {/* Dialogs */}
      {selectedStudent && (
        <DeleteStudentDialog
          student={selectedStudent}
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDeleted={handleUpdated}
        />
      )}
      {selectedStudent && (
        <RestoreStudentDialog
          student={selectedStudent}
          open={restoreDialogOpen}
          onClose={() => setRestoreDialogOpen(false)}
          onDeleted={handleUpdated}
        />
      )}
      {selectedStudent && (
        <EditStudentDrawer
          open={openEditDrawer}
          onClose={() => setOpenEditDrawer(false)}
          studentId={selectedStudent.id}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
};

export default ListStudent;
