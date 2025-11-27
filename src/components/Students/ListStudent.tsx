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

const ListStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [openAddDrawer, setOpenAddDrawer] = useState<boolean>(false);
  const [openEditDrawer, setOpenEditDrawer] = useState<boolean>(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState<boolean>(false);

  // Debounce search
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
        params: {
          search: debouncedSearch,
          page,
          limit,
          isActive: true,
        },
      });

      setStudents(res.data.items || []);
      setTotalPages(res.data.meta?.pages || 1);
    } catch (error) {
      console.error(error);
      setError("Studentlarni olishda xatolik yuz berdi");
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
        <Loader2 className="animate-spin mr-2 w-6 h-6" /> Loading students...
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 dark:text-red-400 p-4 rounded-md bg-red-50 dark:bg-red-900">
        {error}
      </div>
    );

  return (
    <div className="space-y-6 w-[98%] mx-auto">
      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full dark:bg-gray-800 dark:text-gray-200"
        />

        <Button
          onClick={() => setOpenAddDrawer(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" /> Add Student
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    {student.isActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>{student.dateOfBirth || "-"}</TableCell>
                  <TableCell>{student.startDate || "-"}</TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(student)}>
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {student.isActive ? (
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(student)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="secondary" size="icon" onClick={() => handleRestore(student)}>
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
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        <span>
          Page <strong>{page}</strong> of {totalPages}
        </span>

        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
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
