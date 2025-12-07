import { Users, UserCheck, UserX } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StudentStatsProps {
  totalStudents: number;
  activeCount: number;
  inactiveCount: number;
}

export const StudentStats = ({
  totalStudents,
  activeCount,
  inactiveCount,
}: StudentStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-4 sm:p-5 border border-blue-200 dark:border-blue-800 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-1 block">
              {t("studentManagement.totalStudents") || "Total Students"}
            </label>
            <p className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">
              {totalStudents}
            </p>
          </div>
          <div className="bg-blue-500 dark:bg-blue-600 text-white p-2 sm:p-3 rounded-xl">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-xl p-4 sm:p-5 border border-emerald-200 dark:border-emerald-800 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium mb-1 block">
              {t("studentManagement.activeStudents") || "Active Students"}
            </label>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-100">
              {activeCount}
            </p>
          </div>
          <div className="bg-emerald-500 dark:bg-emerald-600 text-white p-2 sm:p-3 rounded-xl">
            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-600 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium mb-1 block">
              {t("studentManagement.inactive") || "Inactive"}
            </label>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {inactiveCount}
            </p>
          </div>
          <div className="bg-slate-500 dark:bg-slate-600 text-white p-2 sm:p-3 rounded-xl">
            <UserX className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};