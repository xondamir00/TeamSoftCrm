import { useEffect } from "react";
import DeleteTeacherDialog from "./deleteTeacher";
import UpdateTeacherDrawer from "./UpdateTeacherForm";
import AddTeacherDrawer from "./AddTeacherForm";
import TeacherSearchBar from "./TeacherSearchBar";
import TeacherStats from "./TeacherStats";
import TeacherTable from "./TeacherTable";
import TeacherPagination from "./TeacherPagination";
import useTeacherStore from "@/Store/teacherStore";

export default function TeacherList() {
  const {
    search,
    setDebouncedSearch,
    setPage,
    selectedTeacher,
    openAddDrawer,
    openEditDrawer,
    deleteDialogOpen,
    setOpenAddDrawer,
    setOpenEditDrawer,
    setDeleteDialogOpen,
    fetchTeachers,
    fetchTeacherStats,
    handleUpdated,
  } = useTeacherStore();
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search, setDebouncedSearch, setPage]);

  useEffect(() => {
    fetchTeachers();
    fetchTeacherStats();
  }, [fetchTeachers, fetchTeacherStats]);

  return (
    <div className="h-screen overflow-hidden p-4">
      <TeacherSearchBar />
      <TeacherStats />
      <TeacherTable />
      <TeacherPagination />

      {selectedTeacher && (
        <>
          <DeleteTeacherDialog
            teacher={selectedTeacher}
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onDeleted={handleUpdated}
          />

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