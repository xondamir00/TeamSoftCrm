import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Student } from "@/Store/Student";
import { api } from "@/Service/api";
import { Loader2 } from "lucide-react";
import { Button } from "../../ui/button";

// Components
import { StudentTable } from "./StudentTable";
import { SearchBar } from "./SearchBar";
import { PageHeader } from "./PageHeader";
import DeleteStudentDialog from "../DeleteStudent";
import RestoreStudentDialog from "../RestoreStudent";
import AddStudentDrawer from "../AddStudentDrawer";
import EditStudentDrawer from "../EditStudentDrawer";
import { StudentStats } from "./StudentStatus";

export const ListStudent = () => {
  const { t } = useTranslation();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch students
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

      const items = res.data.items || [];
      setStudents(items);
      setTotalPages(res.data.meta?.pages || 1);
      setTotalStudents(res.data.meta?.total || 0);
      setActiveCount(items.length);
      setInactiveCount(0);
    } catch (err: unknown) {
      console.error("Error fetching students:", err);
      setError(t("studentManagement.error") || "Error loading students");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStudentStats = async () => {
    try {
      const activeRes = await api.get("/students", {
        params: {
          limit: 1000,
          isActive: true,
        },
      });

      const inactiveRes = await api.get("/students", {
        params: {
          limit: 1000,
          isActive: false,
        },
      });

      const activeStudents = activeRes.data.items || [];
      const inactiveStudents = inactiveRes.data.items || [];

      setTotalStudents(activeStudents.length + inactiveStudents.length);
      setActiveCount(activeStudents.length);
      setInactiveCount(inactiveStudents.length);
    } catch (err) {
      console.error("Error fetching stats:", err);
      const activeStudents = students.filter((s) => s.isActive);
      setActiveCount(activeStudents.length);
      setInactiveCount(students.length - activeStudents.length);
      setTotalStudents(students.length);
    }
  };

  // Load students when search or page changes
  useEffect(() => {
    fetchStudents();
  }, [debouncedSearch, page]);

  // Load statistics on mount
  useEffect(() => {
    fetchStudentStats();
  }, []);

  // Event handlers
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
    fetchStudentStats();
    setDeleteDialogOpen(false);
    setRestoreDialogOpen(false);
    setOpenEditDrawer(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 w-12 h-12 text-blue-600 dark:text-blue-400" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            {t("studentManagement.loading") || "Loading students..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-6 rounded-2xl shadow-lg max-w-md">
          <p className="font-semibold text-lg mb-2">
            {t("studentManagement.error") || "Error"}
          </p>
          <p>{error}</p>
          <Button onClick={fetchStudents} className="mt-4" variant="outline">
            {t("studentManagement.tryAgain") || "Try Again"}
          </Button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 overflow-hidden flex flex-col transition-colors duration-300">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full p-4 sm:p-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <PageHeader />
            
            <StudentStats
              totalStudents={totalStudents}
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
            limit={limit}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Dialogs and Drawers */}
      {selectedStudent && (
        <>
          <DeleteStudentDialog
            student={selectedStudent}
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onDeleted={handleUpdated}
          />
          <RestoreStudentDialog
            student={selectedStudent}
            open={restoreDialogOpen}
            onClose={() => setRestoreDialogOpen(false)}
            onDeleted={handleUpdated}
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