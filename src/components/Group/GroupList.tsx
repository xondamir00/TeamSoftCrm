"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import AddGroupForm from "./AddGoup";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  type Group,
  type Room,
  type GroupsResponse,
  GroupService,
} from "@/Store/group";

export default function GroupList() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError("");
      const data: GroupsResponse = await GroupService.getGroups({
        page: 1,
        limit: 30,
        search: search || undefined,
      });

      const activeGroups = (data.items || []).filter(
        (g: Group) => g.isActive !== false
      );
      setGroups(activeGroups);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const data: Room[] = await GroupService.getRooms();
      setRooms(data);
    } catch {
      setRooms([]);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchRooms();
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setLoading(true);
      await GroupService.deleteGroup(deleteTarget.id);
      setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time?: string): string => {
    if (!time) return "-";
    try {
      const date = new Date(`1970-01-01T${time}`);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time;
    }
  };

  const getRoomName = (roomId?: string): string =>
    rooms.find((r) => r.id === roomId)?.name ?? "-";

  const getDaysPatternText = (pattern?: string): string => {
    if (!pattern) return "-";
    switch (pattern) {
      case "ODD":
        return t("odd_days_label");
      case "EVEN":
        return t("even_days_label");
      case "CUSTOM":
        return t("custom_days_label");
      default:
        return pattern;
    }
  };

  const openModal = (group: Group | null) => {
    setEditingGroup(group);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingGroup(null);
  };

  const handleSuccess = () => {
    closeModal();
    fetchGroups();
  };

  return (
    <div className="space-y-6 w-[98%] mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          placeholder={t("search_groups")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full dark:bg-gray-800 dark:text-gray-200"
        />

        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => openModal(null)}
        >
          <Plus className="w-4 h-4" /> {t("add_group")}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm dark:shadow-black/30">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr>
              <th className="p-3 text-left dark:text-gray-300">{t("name")}</th>
              <th className="p-3 text-left dark:text-gray-300">{t("room")}</th>
              <th className="p-3 text-left dark:text-gray-300">
                {t("capacity")}
              </th>
              <th className="p-3 text-left dark:text-gray-300">
                {t("days_pattern")}
              </th>
              <th className="p-3 text-left dark:text-gray-300">{t("time")}</th>
              <th className="p-3 text-right dark:text-gray-300">
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  <Loader2 className="animate-spin mx-auto w-6 h-6" />
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  {t("no_groups")}
                </td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr
                  key={group.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3 dark:text-gray-300">{group.name}</td>
                  <td className="p-3 dark:text-gray-300">
                    {getRoomName(group.roomId)}
                  </td>
                  <td className="p-3 dark:text-gray-300">
                    {group.capacity ?? "-"}
                  </td>
                  <td className="p-3 dark:text-gray-300">
                    {getDaysPatternText(group.daysPattern)}
                  </td>
                  <td className="p-3 dark:text-gray-300">
                    {formatTime(group.startTime)} - {formatTime(group.endTime)}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => openModal(group)}
                        className="dark:border-gray-600 dark:text-gray-300"
                        title={t("edit")}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteTarget(group)}
                        title={t("delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 w-full sm:max-w-md h-full flex flex-col shadow-xl"
          >
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold dark:text-white">
                {editingGroup ? t("edit_group") : t("add_group")}
              </h2>
              <Button
                variant="outline"
                onClick={closeModal}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                {t("close")}
              </Button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <AddGroupForm
                editingGroup={editingGroup}
                onSuccess={handleSuccess}
              />
            </div>
          </motion.div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-sm w-full"
          >
            <h2 className="text-lg font-semibold dark:text-white mb-2">
              {t("delete_confirm_title")}
            </h2>
            <p className="dark:text-gray-300 mb-4">
              {t("delete_confirm_text")} "{deleteTarget.name}"?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                {t("cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t("delete")
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
