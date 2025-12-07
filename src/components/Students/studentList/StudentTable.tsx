import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, Pencil, Trash2, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Student } from "@/Store/Student";
import { Button } from "@/components/ui/button";

interface StudentTableProps {
  students: Student[];
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentTable = ({
  students,
  page,
  limit,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: StudentTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
            <TableRow className="border-b-2 border-slate-200 dark:border-slate-600">
              <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                <label>{t("studentManagement.tableHeaders.number") || "#"}</label>
              </TableHead>
              <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                <label>{t("studentManagement.tableHeaders.name") || "Name"}</label>
              </TableHead>
              <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden sm:table-cell">
                <label>{t("studentManagement.tableHeaders.phone") || "Phone"}</label>
              </TableHead>
              <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                <label>{t("studentManagement.tableHeaders.status") || "Status"}</label>
              </TableHead>
              <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden md:table-cell">
                <label>{t("studentManagement.tableHeaders.birthDate") || "Birth Date"}</label>
              </TableHead>
              <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                <label>{t("studentManagement.tableHeaders.startDate") || "Start Date"}</label>
              </TableHead>
              <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                <label>{t("studentManagement.tableHeaders.actions") || "Actions"}</label>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {t("studentManagement.noStudents") || "No active students found"}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                    {t("studentManagement.noStudentsHint") || "Try adjusting your search or add new students"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student, index) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-blue-50/50 dark:hover:bg-blue-900/30 transition-colors border-b border-slate-100 dark:border-slate-700"
                >
                  <TableCell className="font-medium text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                    <span>{(page - 1) * limit + index + 1}</span>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                    <span>{student.fullName}</span>
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden sm:table-cell">
                    <span>{student.phone}</span>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <span
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t("studentManagement.statuses.active") || "Active"}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm hidden md:table-cell">
                    <span>{formatDate(student.dateOfBirth)}</span>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm hidden lg:table-cell">
                    <span>{formatDate(student.startDate)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`${student.id}`)}
                        className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        title={t("studentManagement.buttons.viewProfile") || "View Profile"}
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(student)}
                        className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-700 dark:hover:text-amber-400"
                        title={t("studentManagement.buttons.edit") || "Edit"}
                      >
                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onDelete(student)}
                        className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-700 dark:hover:bg-red-800"
                        title={t("studentManagement.buttons.delete") || "Delete"}
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
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          {t("studentManagement.previous") || "Previous"}
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            {t("studentManagement.page") || "Page"}{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {page}
            </span>{" "}
            {t("studentManagement.of") || "of"}{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {totalPages}
            </span>
          </span>
        </div>

        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="w-full sm:w-auto text-xs sm:text-sm"
        >
          {t("studentManagement.next") || "Next"}
        </Button>
      </div>
    </div>
  );
};