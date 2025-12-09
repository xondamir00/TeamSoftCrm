import { useEffect } from "react";
import UpdateTeacherDrawer from "@/Featured/Teachers/UpdateTeacherForm";
import AddTeacherDrawer from "@/Featured/Teachers/AddTeacherForm";
import TeacherSearchBar from "@/Featured/Teachers/TeacherSearchBar";
import TeacherStats from "@/Featured/Teachers/TeacherStats";
import TeacherTable from "@/Featured/Teachers/TeacherTable";
import TeacherPagination from "@/Featured/Teachers/TeacherPageNavigation";
import useTeacherStore from "@/Service/TeacherService/TeacherService";
import DeleteTeacherDialog from "@/Featured/Teachers/DeleteTeacher";

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
    <div className=" overflow-hidden p-4">
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
