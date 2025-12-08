import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Link } from "react-router-dom";
import type { Group } from "@/Store";
import { useTranslation } from "react-i18next";

export default function MyGroups() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyGroups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Group[]>("/teachers/my-groups");
      setGroups(data || []);
    } catch (error) {
      console.error("Failed to fetch my groups:", error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  return (
    <div className="mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
        {t("myGroups")}
      </h1>

      {loading ? (
        <p className="text-center dark:text-white">{t("loading")}</p>
      ) : groups.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          {t("noGroups")}
        </p>
      ) : (
        <div className="space-y-4 flex items-center w-[50%] justify-around mx-auto">
          {groups.map((group) => (
            <Link key={group.groupId} to={`group/${group.groupId}`}>
              <div className="border rounded-lg py-4 px-12 bg-white dark:bg-gray-900 shadow-sm">
                <h2 className="text-xl font-semibold dark:text-white">
                  {group.groupName}
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
