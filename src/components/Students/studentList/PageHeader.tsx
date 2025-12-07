import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export const PageHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {t("studentManagement.title") || "Student Management"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t("studentManagement.subtitle") || "Manage and track active students"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-3 sm:p-4 rounded-2xl shadow-lg">
          <Users className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      </div>
    </div>
  );
};