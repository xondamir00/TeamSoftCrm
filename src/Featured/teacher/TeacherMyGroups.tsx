import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useTeacherStore from "@/Service/TeacherService";

export default function MyGroups() {
  const { t } = useTranslation();
  
  const { 
    myGroups, 
    groupsLoading, 
    fetchMyGroups 
  } = useTeacherStore();

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  return (
    <div className="mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
        {t("myGroups")}
      </h1>

      {groupsLoading ? (
        <p className="text-center dark:text-white">{t("loading")}</p>
      ) : myGroups.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          {t("noGroups")}
        </p>
      ) : (
        <div className="space-y-4 flex items-center w-[50%] justify-around mx-auto">
          {myGroups.map((group) => (
            <Link key={group.id} to={`group/${group.id}`}>
              <div className="border rounded-lg py-4 px-12 bg-white dark:bg-gray-900 shadow-sm">
                <h2 className="text-xl font-semibold dark:text-white">
                  {group.name}
                </h2>

                <p className="text-gray-700 dark:text-gray-300">
                  {t("room")}: {group.room?.name || "-"}
                </p>

                <p className="text-gray-700 dark:text-gray-300">
                  {t("days")}: {group.daysPattern || "-"}
                </p>

                <p className="text-gray-700 dark:text-gray-300">
                  {t("time")}: {group.startTime || "-"} - {group.endTime || "-"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}