"use client";

import { Loader2, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import type { Group, GroupTableProps } from "@/Store/Group/GroupInterface";


export function GroupTable({
  groups,
  rooms,
  loading,
  onEdit,
  onDelete,
  formatTime,
}: GroupTableProps) {
  const { t } = useTranslation();

  const getRoomName = (roomId?: string) => 
    rooms.find(r => r.id === roomId)?.name || "-";

  return (
    <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-x-auto dark:shadow-black/40 bg-white dark:bg-gray-900 transition-colors duration-300">
      <table className="w-full min-w-[600px]">
        <thead className="bg-gray-100 dark:bg-gray-800/60">
          <tr>
            <th className="p-3 text-left dark:text-gray-200">
              {t("groupManagement.name") || "Name"}
            </th>
            <th className="p-3 text-left dark:text-gray-200">
              {t("groupManagement.room") || "Room"}
            </th>
            <th className="p-3 text-left dark:text-gray-200">
              {t("groupManagement.capacity") || "Capacity"}
            </th>
            <th className="p-3 text-left dark:text-gray-200">
              {t("groupManagement.days") || "Days"}
            </th>
            <th className="p-3 text-left dark:text-gray-200">
              {t("groupManagement.time") || "Time"}
            </th>
            <th className="p-3 text-right dark:text-gray-200">
              {t("groupManagement.actions") || "Actions"}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableLoader />
          ) : groups.length === 0 ? (
            <TableEmpty />
          ) : (
            groups.map((group) => (
              <GroupRow
                key={group.id}
                group={group}
                roomName={getRoomName(group.room?.id)}
                formatTime={formatTime}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableLoader() {
  const { t } = useTranslation();
  
  return (
    <tr>
      <td colSpan={6} className="text-center py-6 dark:text-gray-300">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        <p className="mt-2 text-sm dark:text-gray-400">
          {t("groupManagement.loading") || "Loading..."}
        </p>
      </td>
    </tr>
  );
}

function TableEmpty() {
  const { t } = useTranslation();
  
  return (
    <tr>
      <td colSpan={6} className="text-center py-6 dark:text-gray-400">
        <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          {t("groupManagement.noGroups") || "No groups found"}
        </p>
      </td>
    </tr>
  );
}

interface GroupRowProps {
  group: Group;
  roomName: string;
  formatTime: (time?: string) => string;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
}

function GroupRow({
  group,
  roomName,
  formatTime,
  onEdit,
  onDelete,
}: GroupRowProps) {
  const { t } = useTranslation();

  return (
    <tr className="border-t dark:border-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/60">
      <td className="p-3 dark:text-gray-200">{group.name}</td>
      <td className="p-3 dark:text-gray-200">{roomName}</td>
      <td className="p-3 dark:text-gray-200">{group.capacity ?? "-"}</td>
      <td className="p-3 dark:text-gray-200">{group.daysPattern || "-"}</td>
      <td className="p-3 dark:text-gray-200">
        {formatTime(group.startTime)} - {formatTime(group.endTime)}
      </td>
      <td className="p-3 flex justify-end gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onEdit(group)}
          className="rounded-xl dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          title={t("groupManagement.editGroup") || "Edit Group"}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onDelete(group)}
          className="rounded-xl hover:bg-red-700 dark:hover:bg-red-800"
          title={t("groupManagement.deleteGroup") || "Delete Group"}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}