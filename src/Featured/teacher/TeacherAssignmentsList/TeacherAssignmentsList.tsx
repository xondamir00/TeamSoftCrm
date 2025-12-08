"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useTeachingAssignmentStore from "@/Service/TeacherAssigmentService";

export const TeachingAssignmentsList = () => {
  const { t } = useTranslation();
  
  // Store'dan state va metodlarni olamiz
  const {
    assignments,
    loading,
    error,
    fetchAssignments,
    setError
  } = useTeachingAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleRetry = () => {
    setError(null);
    fetchAssignments();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400 dark:text-gray-500" />
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive" className="my-4 shadow-lg">
        <AlertDescription className="flex flex-col gap-2">
          {error}
          <button 
            onClick={handleRetry}
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition self-start"
          >
            {t("retry") || "Try Again"}
          </button>
        </AlertDescription>
      </Alert>
    );

  if (!assignments.length)
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {t("no_assignments")}
        </p>
        <button 
          onClick={() => fetchAssignments()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {t("refresh") || "Refresh"}
        </button>
      </div>
    );

  const rowVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("teaching_assignments")}
        </h2>
        <button
          onClick={() => fetchAssignments()}
          className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {t("refresh") || "Refresh"}
        </button>
      </div>
      
      <div className="hidden md:block overflow-x-auto rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-900">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                #
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("teacher")}
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("group")}
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("role")}
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-green-500 dark:text-green-500">
                {t("status")}
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("note")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
            {assignments.map((a, i) => (
              <motion.tr
                key={a.id}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer even:bg-gray-50 dark:even:bg-gray-900"
              >
                <td className="px-5 py-3 text-gray-700 dark:text-gray-200 font-medium">
                  {i + 1}
                </td>
                <td className="px-5 py-3">
                  <div className="text-gray-800 dark:text-gray-200">
                    {a.teacher?.firstName} {a.teacher?.lastName}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {a.teacherId}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="text-gray-700 dark:text-gray-300">
                    {a.group?.name || "Unknown Group"}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {a.groupId}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-200 capitalize">
                  {a.role}
                </td>
                <td className="px-5 py-3">
                  <Badge
                    variant={a.isActive ? "default" : "destructive"}
                    className={`px-3 py-1 text-sm ${
                      a.isActive 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {a.isActive ? t("active") : t("inactive")}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300 max-w-xs">
                  {a.note ? (
                    <div className="truncate" title={a.note}>
                      {a.note}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile view */}
      <div className="md:hidden flex flex-col gap-4">
        {assignments.map((a, i) => (
          <motion.div
            key={a.id}
            initial="hidden"
            animate="visible"
            variants={rowVariants}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-4 flex flex-col gap-2 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {a.teacher?.firstName} {a.teacher?.lastName}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Teacher ID: {a.teacherId}
                </p>
              </div>
              <Badge
                variant={a.isActive ? "default" : "destructive"}
                className={a.isActive 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-red-500 hover:bg-red-600 text-white"
                }
              >
                {a.isActive ? t("active") : t("inactive")}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Group</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {a.group?.name || "Unknown Group"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {a.groupId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                <p className="font-medium text-gray-700 dark:text-gray-200 capitalize">
                  {a.role}
                </p>
              </div>
            </div>
            
            {a.note && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Note</p>
                <p className="text-gray-700 dark:text-gray-300 break-words">
                  {a.note}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};