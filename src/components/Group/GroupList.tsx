"use client";
import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import AddGroupForm from "./AddGoup";
import { motion } from "framer-motion";

interface Group {
  id: string;
  name: string;
  roomId?: string;
  capacity?: number;
  daysPattern?: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
}

export default function GroupList() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/groups", {
        params: { page: 1, limit: 10 },
      });

      // 🔥 Faqat ACTIVE guruhlarni ko‘rsatish
      setGroups((data.items || []).filter((g: any) => g.isActive !== false));
    } catch (err: any) {
      setError(err?.response?.data?.message || t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRooms = async () => {
    try {
      const { data } = await api.get("/rooms");
      setRooms(data);
    } catch (err) {
      console.error("Xonalarni olishda xato:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setLoading(true);
      await api.delete(`/groups/${deleteTarget.id}`);
      setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "O‘chirishda xatolik yuz berdi"
      );
      setDeleteTarget(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchRooms();
  }, []);

  const formatTime = (time?: string) => {
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

  const getRoomName = (roomId?: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.name : "-";
  };

  const openModal = (group: Group | null) => {
    setEditingGroup(group);
    setModalOpen(true);
  };

  return (
    <div className="w-[98%] mx-auto bg-white dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("groups_list")}</h2>

        {/* Add Group button */}
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          onClick={() => openModal(null)}
        >
          <Plus className="w-4 h-4" /> {t("add_group")}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500 text-center">{t("no_groups")}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left p-2">{t("name")}</th>
              <th className="text-left p-2">{t("room")}</th>
              <th className="text-left p-2">{t("capacity")}</th>
              <th className="text-left p-2">Days</th>
              <th className="text-left p-2">{t("time")}</th>
              <th className="text-right p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr
                key={g.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-2">{g.name}</td>
                <td className="p-2">{getRoomName(g.roomId)}</td>
                <td className="p-2">{g.capacity ?? "-"}</td>
                <td className="p-2">{g.daysPattern || "-"}</td>
                <td className="p-2">
                  {`${formatTime(g.startTime)} - ${formatTime(g.endTime)}`}
                </td>
                <td className="p-2 text-right flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(g)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteTarget(g)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for edit/add group */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex justify-end z-50">
          <motion.div
            initial={{ x: "100%" }} // Ekranning o'ng tomonidan kiradi
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="bg-white dark:bg-gray-900 w-full sm:max-w-md h-full shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold dark:text-white">
                  {editingGroup ? t("edit_group") : t("add_group")}
                </h2>
                <p className="dark:text-gray-300 text-sm">
                  {editingGroup
                    ? t("edit_group_description")
                    : t("add_group_description")}
                </p>
              </div>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                {t("close")}
              </Button>
            </div>

            {/* Form */}
            <div className="p-4 flex-1 overflow-y-auto">
              <AddGroupForm
                editingGroup={editingGroup}
                onSuccess={() => {
                  setModalOpen(false);
                  fetchGroups();
                }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal for delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full shadow-lg space-y-4"
          >
            <h2 className="text-lg font-semibold dark:text-white">
              {t("delete_confirm_title") || "O‘chirishni tasdiqlang"}
            </h2>
            <p className="dark:text-gray-300">
              {t("delete_confirm_text") ||
                `"${deleteTarget.name}" guruhini o‘chirishni xohlaysizmi?`}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="dark:border-gray-600"
                onClick={() => setDeleteTarget(null)}
              >
                {t("cancel")}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                {t("delete") || "O‘chirish"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
