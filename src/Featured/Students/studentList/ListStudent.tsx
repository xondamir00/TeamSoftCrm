import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Student } from "@/Store/Student/StudentInterface";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Components
import { StudentTable } from "@/Featured/Students/studentList/StudentTable";
import { SearchBar } from "@/Featured/Students/studentList/SearchBar";
import { PageHeader } from "@/Featured/Students/studentList/PageHeader";
import DeleteStudentDialog from "@/Featured/Students/DeleteStudent";
import RestoreStudentDialog from "@/Featured/Students/RestoreStudent";
import AddStudentDrawer from "@/Featured/Students/AddStudentDrawer";
import EditStudentDrawer from "@/Featured/Students/EditStudentDrawer";
import { StudentStats } from "@/Featured/Students/studentList/StudentStatus";
import { useStudentStore } from "@/Service/StudentService/StudentService";

export const ListStudent = () => {
  const { t } = useTranslation();

  // Zustand store hooks
  const {
    students,
    totalPages,
    loading,
    error,
    fetchStudents,
    deleteStudent,
    restoreStudent,
  } = useStudentStore();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch students on page or search change
  useEffect(() => {
    fetchStudents(debouncedSearch, page, 10).then(() => {
      const allStudents = useStudentStore.getState().students;
      const active = allStudents.filter((s) => s.isActive).length;
      const inactive = allStudents.filter((s) => !s.isActive).length;
      setActiveCount(active);
      setInactiveCount(inactive);
    });
  }, [debouncedSearch, page, fetchStudents]);

  // Event handlers
  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setOpenEditDrawer(true);
  };

  const handleUpdated = () => {
    fetchStudents(debouncedSearch, page, 10);
    setDeleteDialogOpen(false);
    setRestoreDialogOpen(false);
    setOpenEditDrawer(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-lg">
          <p className="font-semibold text-lg">
            {t("studentManagement.error")}
          </p>
          <p>{error}</p>
          <Button onClick={() => fetchStudents(debouncedSearch, page, 10)}>
            {t("studentManagement.tryAgain")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="dark:bg-slate-900 rounded-2xl shadow-lg p-4">
          <PageHeader />

          <StudentStats
            totalStudents={students.length}
            activeCount={activeCount}
            inactiveCount={inactiveCount}
          />

          <SearchBar
            search={search}
            onSearchChange={setSearch}
            onAddClick={() => setOpenAddDrawer(true)}
          />
        </div>

        <StudentTable
          students={students}
          page={page}
          limit={10}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {selectedStudent && (
        <>
          <DeleteStudentDialog
            student={selectedStudent}
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onDeleted={async () => {
              await deleteStudent(selectedStudent.id);
              handleUpdated();
            }}
          />
          <RestoreStudentDialog
            student={selectedStudent}
            open={restoreDialogOpen}
            onClose={() => setRestoreDialogOpen(false)}
            onUpdated={async () => {
              await restoreStudent(selectedStudent.id);
              handleUpdated();
            }}
          />
          <EditStudentDrawer
            open={openEditDrawer}
            onClose={() => setOpenEditDrawer(false)}
            studentId={selectedStudent.id}
            onUpdated={handleUpdated}
          />
        </>
      )}

      <AddStudentDrawer
        open={openAddDrawer}
        onClose={() => setOpenAddDrawer(false)}
        onAdded={handleUpdated}
      />
    </div>
  );
};

export default ListStudent;
