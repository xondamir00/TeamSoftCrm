import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Loader2, Plus, Pencil, Trash2, Search, Users, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import type { Teacher } from "@/Store";
import DeleteTeacherDialog from "./deleteTeacher";
import UpdateTeacherDrawer from "./UpdateTeacherForm";
import AddTeacherDrawer from "./AddTeacherForm";


export default function TeacherList() {
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchTeachers = async () => {
  try {
    setLoading(true);
    const res = await api.get("/teachers", {
      params: {
        search: debouncedSearch,
        page,
        limit,
        isActive: true, // <-- faqat aktivlarni chiqarish
      },
    });

    const items = res.data.items || [];
    setTeachers(items);
    setTotalPages(res.data.meta?.pages || 1);
    setTotalTeachers(res.data.meta?.total || 0);

    const active = items.filter((t) => t.isActive).length;
    setActiveCount(active);

    // Inactive lar faqat statsdan keladi
  } catch (err: unknown) {
    console.error("Error fetching teachers:", err);
    setError(t("fetch_error") || "Error loading teachers");
  } finally {
    setLoading(false);
  }
};


  const fetchTeacherStats = async () => {
    try {
      const activeRes = await api.get("/teachers", {
        params: {
          limit: 1000,
          isActive: true,
        },
      });

      const inactiveRes = await api.get("/teachers", {
        params: {
          limit: 1000,
          isActive: false,
        },
      });

      const activeTeachers = activeRes.data.items || [];
      const inactiveTeachers = inactiveRes.data.items || [];

      setTotalTeachers(activeTeachers.length + inactiveTeachers.length);
      setActiveCount(activeTeachers.length);
      setInactiveCount(inactiveTeachers.length);
    } catch (err) {
      console.error("Error fetching stats:", err);
      const activeTeachers = teachers.filter((t) => t.isActive);
      setActiveCount(activeTeachers.length);
      setInactiveCount(teachers.length - activeTeachers.length);
      setTotalTeachers(teachers.length);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchTeacherStats();
  }, []);

  const handleDelete = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpenEditDrawer(true);
  };

  const handleUpdated = () => {
    fetchTeachers();
    fetchTeacherStats();
    setDeleteDialogOpen(false);
    setOpenEditDrawer(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${day}.${month}.${year}`;
    } catch {
      return "-";
    }
  };

  if (loading)
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 w-12 h-12 text-blue-600 dark:text-blue-400" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading teachers...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-6 rounded-2xl shadow-lg max-w-md">
          <p className="font-semibold text-lg mb-2">Error</p>
          <p>{error}</p>
          <Button
            onClick={fetchTeachers}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 overflow-hidden flex flex-col transition-colors duration-300">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full p-4 sm:p-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Teacher Management</h1>
                <p className="text-slate-600 dark:text-slate-400">Manage and track all teachers</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-3 sm:p-4 rounded-2xl shadow-lg">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-4 sm:p-5 border border-blue-200 dark:border-blue-800 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-1">Total Teachers</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">{totalTeachers}</p>
                  </div>
                  <div className="bg-blue-500 dark:bg-blue-600 text-white p-2 sm:p-3 rounded-xl">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-xl p-4 sm:p-5 border border-emerald-200 dark:border-emerald-800 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium mb-1">Active Teachers</p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-100">{activeCount}</p>
                  </div>
                  <div className="bg-emerald-500 dark:bg-emerald-600 text-white p-2 sm:p-3 rounded-xl">
                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-600 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium mb-1">Inactive</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{inactiveCount}</p>
                  </div>
                  <div className="bg-slate-500 dark:bg-slate-600 text-white p-2 sm:p-3 rounded-xl">
                    <UserX className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Button
                onClick={() => setOpenAddDrawer(true)}
                className="flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" /> Add Teacher
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <TableRow className="border-b-2 border-slate-200 dark:border-slate-600">
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">#</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Photo</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Name</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden sm:table-cell">Phone</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden md:table-cell">Date Added</TableHead>
                    <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {teachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No teachers found</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Try adjusting your search or add new teachers</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    teachers.map((teacher, index) => (
                      <TableRow key={teacher.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/30 transition-colors border-b border-slate-100 dark:border-slate-700">
                        <TableCell className="font-medium text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                          {(page - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <img
                            src={teacher.photoUrl || "/default-avatar.png"}
                            alt={teacher.firstName}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {teacher.fullName || `${teacher.firstName} ${teacher.lastName}`}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden sm:table-cell">{teacher.phone}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${
                              teacher.isActive
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700"
                                : "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${teacher.isActive ? "bg-emerald-500" : "bg-slate-500"}`} />
                            {teacher.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm hidden md:table-cell">
                          {formatDate(teacher.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(teacher)}
                              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-700 dark:hover:text-amber-400"
                            >
                              <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(teacher)}
                              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-700 dark:hover:bg-red-800"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
                </span>
              </div>

              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

{selectedTeacher && (
  <>
    {/* Delete dialog with blur */}
    {deleteDialogOpen && (
      <DeleteTeacherDialog 
        teacher={selectedTeacher}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDeleted={handleUpdated}
      />
    )}

    {/* Edit drawer */}
    <UpdateTeacherDrawer
      open={openEditDrawer}
      onClose={() => setOpenEditDrawer(false)}
      teacherId={selectedTeacher.id}
      onUpdated={handleUpdated}
    />
  </>
)}



      <AddTeacherDrawer
        open={openAddDrawer}
        onClose={() => setOpenAddDrawer(false)}
        onAdded={handleUpdated}
      />
    </div>
  );
}
