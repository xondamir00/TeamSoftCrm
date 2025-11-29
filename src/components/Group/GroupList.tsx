"use client";
import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import AddGroupForm from "./AddGoup";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState("");

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/groups", {
        params: { page: 1, limit: 30, search },
      });

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

  useEffect(() => {
    fetchGroups();
    fetchRooms();
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setLoading(true);
      await api.delete(`/groups/${deleteTarget.id}`);
      setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "O‘chirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="space-y-6 w-[98%] mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          placeholder="Search groups..."
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

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm dark:shadow-black/30">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr>
              <th className="p-3 text-left dark:text-gray-300">{t("name")}</th>
              <th className="p-3 text-left dark:text-gray-300">{t("room")}</th>
              <th className="p-3 text-left dark:text-gray-300">
                {t("capacity")}
              </th>
              <th className="p-3 text-left dark:text-gray-300">Days</th>
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
              groups.map((g) => (
                <tr
                  key={g.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3">{g.name}</td>
                  <td className="p-3">{getRoomName(g.roomId)}</td>
                  <td className="p-3">{g.capacity ?? "-"}</td>
                  <td className="p-3">{g.daysPattern || "-"}</td>
                  <td className="p-3">
                    {formatTime(g.startTime)} - {formatTime(g.endTime)}
                  </td>
                  <td className="p-3 text-right flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => openModal(g)}
                      className="dark:border-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setDeleteTarget(g)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer / Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 w-full sm:max-w-md h-full flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold dark:text-white">
                {editingGroup ? t("edit_group") : t("add_group")}
              </h2>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                {t("close")}
              </Button>
            </div>

            {/* Form */}
            <div className="p-4 overflow-y-auto flex-1">
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

      {/* Delete Modal */}
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
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                {t("cancel")}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                {t("delete")}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
