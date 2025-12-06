// components/TeacherTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTeacherStore from "@/Store/teacherStore";
import type { Teacher } from "@/Store";

export default function TeacherTable() {
  const { t } = useTranslation();
  
  // Store'dan kerakli ma'lumotlarni olish
  const { 
    teachers, 
    loading, 
    error, 
    setSelectedTeacher, 
    setOpenEditDrawer, 
    setDeleteDialogOpen 
  } = useTeacherStore();

  // Edit handler
  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpenEditDrawer(true);
  };

  // Delete handler
  const handleDelete = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-600">{error}</div>
    );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>{t("photo") || "Photo"}</TableHead>
              <TableHead>{t("name") || "Name"}</TableHead>
              <TableHead>{t("phone") || "Phone"}</TableHead>
              <TableHead>{t("status") || "Status"}</TableHead>
              <TableHead className="text-right">{t("actions") || "Actions"}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  {t("no_teachers") || "No teachers found"}
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher, i) => (
                <TableRow key={teacher.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <img
                      src={teacher.photoUrl || "/default-avatar.png"}
                      alt={teacher.fullName}
                      className="w-9 h-9 rounded-full"
                    />
                  </TableCell>
                  <TableCell>{teacher.fullName}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>
                    {teacher.isActive ? (
                      <span className="px-3 py-1 text-xs bg-emerald-200 text-emerald-700 rounded-full">
                        {t("active") || "Active"}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                        {t("inactive") || "Inactive"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleEdit(teacher)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => handleDelete(teacher)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}