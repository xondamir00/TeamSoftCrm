// components/TeacherStats.tsx - soddalashtirilgan
import { Users, UserCheck, UserX } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTeacherStore from "@/Store/teacherStore";

export default function TeacherStats() {
  const { t } = useTranslation();
  
  // Endi store'dan to'g'ridan-to'g'ri total, active, inactive olishimiz mumkin
  const { total, active, inactive } = useTeacherStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* TOTAL */}
      <div className="p-5 rounded-xl bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
              {t("total_teachers") || "Total Teachers"}
            </p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {total}
            </p>
          </div>
          <Users className="w-7 h-7 text-blue-700 dark:text-blue-300" />
        </div>
      </div>

      {/* ACTIVE */}
      <div className="p-5 rounded-xl bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              {t("active_teachers") || "Active Teachers"}
            </p>
            <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
              {active}
            </p>
          </div>
          <UserCheck className="w-7 h-7 text-emerald-700 dark:text-emerald-300" />
        </div>
      </div>

      {/* INACTIVE */}
      <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              {t("inactive_teachers") || "Inactive Teachers"}
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {inactive}
            </p>
          </div>
          <UserX className="w-7 h-7 text-slate-700 dark:text-slate-300" />
        </div>
      </div>
    </div>
  );
}