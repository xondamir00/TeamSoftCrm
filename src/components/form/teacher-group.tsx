"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";

interface Group {
  groupId: string;
  groupName: string;
  room?: {
    id: string;
    name: string;
    capacity?: number;
  };
  startTime?: string;
  endTime?: string;
  daysPattern?: string;
}

export default function MyGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyGroups = async () => {
    try {
      // setLoading(true);
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
        My Groups
      </h1>

      {loading ? (
        <p className="text-center dark:text-white">Loading...</p>
      ) : groups.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          You have no assigned groups.
        </p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.groupId}
              className="border rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm"
            >
              <h2 className="text-xl font-semibold dark:text-white">
                {group.groupName}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Room: {group.room?.name || "-"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Days: {group.daysPattern || "-"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Time: {group.startTime || "-"} - {group.endTime || "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
