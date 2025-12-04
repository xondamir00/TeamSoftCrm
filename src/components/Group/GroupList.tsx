"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import {
  Loader2,
  Pencil,
  Trash2,
  Plus,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import AddGroupForm from "./AddGoup";
import { GroupService } from "@/Store/group";

interface Group {
  id: string;
  name: string;
  roomId?: string;
  capacity?: number;
  daysPattern?: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  isActive?: boolean;
}

interface Room {
  id: string;
  name: string;
}

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/groups", {
        params: { page: 1, limit: 50, search },
      });
      setGroups(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const data: Room[] = await GroupService.getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Room fetch error:", err);
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

  const getRoomName = (roomId?: string) =>
    rooms.find((r) => r.id === roomId)?.name || "-";

  const openModal = (group: Group | null) => {
    setEditingGroup(group);
    setModalOpen(true);
  };

  const activeGroups = groups.filter((g) => g.isActive !== false);
  const inactiveGroupsCount = groups.filter((g) => g.isActive === false).length;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 overflow-hidden flex flex-col transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Group Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Manage and track all groups
              </p>
            </div>
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-3 rounded-2xl shadow-lg">
                <Users className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl p-4 border border-blue-200 dark:border-blue-800 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-1">
                    Total Groups
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {groups.length}
                  </p>
                </div>
                <div className="bg-blue-500 dark:bg-blue-600 text-white p-2 sm:p-3 rounded-xl">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium mb-1">
                    Active Groups
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                    {activeGroups.length}
                  </p>
                </div>
                <div className="bg-emerald-500 dark:bg-emerald-600 text-white p-2 sm:p-3 rounded-xl">
                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium mb-1">
                    Inactive Groups
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {inactiveGroupsCount}
                  </p>
                </div>
                <div className="bg-slate-500 dark:bg-slate-600 text-white p-2 sm:p-3 rounded-xl">
                  <UserX className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Input
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md dark:bg-gray-800 dark:text-gray-200"
            />
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md rounded-xl px-5 py-2"
              onClick={() => openModal(null)}
            >
              <Plus className="w-4 h-4" /> Add Group
            </Button>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-x-auto dark:shadow-black/40 bg-white dark:bg-gray-900 transition-colors duration-300">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-100 dark:bg-gray-800/60">
              <tr>
                <th className="p-3 text-left dark:text-gray-200">Name</th>
                <th className="p-3 text-left dark:text-gray-200">Room</th>
                <th className="p-3 text-left dark:text-gray-200">Capacity</th>
                <th className="p-3 text-left dark:text-gray-200">Days</th>
                <th className="p-3 text-left dark:text-gray-200">Time</th>
                <th className="p-3 text-right dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 dark:text-gray-300"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : activeGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 dark:text-gray-400"
                  >
                    No groups found
                  </td>
                </tr>
              ) : (
                activeGroups.map((g) => (
                  <tr
                    key={g.id}
                    className="border-t dark:border-gray-800 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  >
                    <td className="p-3 dark:text-gray-200">{g.name}</td>
                    <td className="p-3 dark:text-gray-200">
                      {getRoomName(g.roomId)}
                    </td>
                    <td className="p-3 dark:text-gray-200">
                      {g.capacity ?? "-"}
                    </td>
                    <td className="p-3 dark:text-gray-200">
                      {g.daysPattern || "-"}
                    </td>
                    <td className="p-3 dark:text-gray-200">
                      {formatTime(g.startTime)} - {formatTime(g.endTime)}
                    </td>
                    <td className="p-3 flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => openModal(g)}
                        className="rounded-xl dark:border-gray-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteTarget(g)}
                        className="rounded-xl"
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
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 w-full sm:max-w-md h-full flex flex-col shadow-xl border-l border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold dark:text-white">
                  {editingGroup ? "Edit Group" : "Add Group"}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl dark:border-gray-600"
                >
                  Close
                </Button>
              </div>
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
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-lg font-semibold dark:text-white mb-2">
                Delete Group
              </h2>
              <p className="dark:text-gray-300 mb-4">
                Are you sure you want to delete "{deleteTarget.name}"?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="rounded-xl"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
