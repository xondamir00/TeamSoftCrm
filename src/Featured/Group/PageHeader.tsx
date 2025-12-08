"use client";

import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import type { PageHeaderProps } from "@/Store/Group/GroupInterface";


export function PageHeader({
  search,
  onSearchChange,
  onAddGroup,
}: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {t("groupManagement.title") || "Group Management"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {t("groupManagement.subtitle") || "Manage and track all groups"}
          </p>
        </div>
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-3 rounded-2xl shadow-lg">
            <Users className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder={t("groupManagement.searchPlaceholder") || "Search groups..."}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md dark:bg-gray-800 dark:text-gray-200"
        />
        <Button
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md rounded-xl px-5 py-2"
          onClick={onAddGroup}
        >
          <Plus className="w-4 h-4" /> {t("groupManagement.addGroup") || "Add Group"}
        </Button>
      </div>
    </div>
  );
}