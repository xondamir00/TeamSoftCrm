"use client";

import type { GroupsResponse, StatCardProps } from "@/Store/Group/GroupInterface";
import { Users, UserCheck, UserX } from "lucide-react";
import { useTranslation } from "react-i18next";


export function GroupStats({ total, active, inactive }: GroupsResponse) {
  const { t } = useTranslation();

  return (
    <div className="grid my-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      <StatCard
        title={t("groupManagement.totalGroups") || "Total Groups"}
        value={total}
        icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
        color="blue"
      />
      <StatCard
        title={t("groupManagement.activeGroups") || "Active Groups"}
        value={active}
        icon={<UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />}
        color="emerald"
      />
      <StatCard
        title={t("groupManagement.inactiveGroups") || "Inactive Groups"}
        value={inactive}
        icon={<UserX className="w-5 h-5 sm:w-6 sm:h-6" />}
        color="slate"
      />
    </div>
  );
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-300",
      value: "text-blue-900 dark:text-blue-100",
      iconBg: "bg-blue-500 dark:bg-blue-600",
    },
    emerald: {
      bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-300",
      value: "text-emerald-900 dark:text-emerald-100",
      iconBg: "bg-emerald-500 dark:bg-emerald-600",
    },
    slate: {
      bg: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700",
      border: "border-slate-200 dark:border-slate-600",
      text: "text-slate-700 dark:text-slate-300",
      value: "text-slate-900 dark:text-slate-100",
      iconBg: "bg-slate-500 dark:bg-slate-600",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`bg-gradient-to-br ${classes.bg} rounded-xl p-4 border ${classes.border} transition-colors duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${classes.text} text-xs sm:text-sm font-medium mb-1`}>
            {title}
          </p>
          <p className={`${classes.value} text-2xl sm:text-3xl font-bold`}>
            {value}
          </p>
        </div>
        <div className={`${classes.iconBg} text-white p-2 sm:p-3 rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}