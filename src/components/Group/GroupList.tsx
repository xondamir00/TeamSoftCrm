"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { GroupService, type Group } from "@/Store/group";
import { useTranslation } from "react-i18next";
import type { Room } from "@/Store/room";
import { GroupTable } from "./GroupTable";
import { DeleteModal } from "./DeleteModal";
import { PageHeader } from "./PageHeader";
import { GroupStats } from "./GroupStatus";
import { GroupModal } from "./Groupmodal";

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
    } catch (err) {
      console.error("Error fetching groups:", err);
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
      await api.delete(`/groups/${deleteTarget.id}`);
      setGroups(prev => prev.filter(g => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting group:", err);
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

  const activeGroups = groups.filter((g) => g.isActive !== false);
  const inactiveGroupsCount = groups.filter((g) => g.isActive === false).length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 overflow-hidden flex flex-col transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          search={search}
          onSearchChange={setSearch}
          onAddGroup={() => setModalOpen(true)}
        />

        <GroupStats
          total={groups.length}
          active={activeGroups.length}
          inactive={inactiveGroupsCount}
        />

        <GroupTable
          groups={activeGroups}
          rooms={rooms}
          loading={loading}
          onEdit={(group) => {
            setEditingGroup(group);
            setModalOpen(true);
          }}
          onDelete={setDeleteTarget}
          formatTime={formatTime}
        />

        <GroupModal
          isOpen={modalOpen}
          editingGroup={editingGroup}
          onClose={() => {
            setModalOpen(false);
            setEditingGroup(null);
          }}
          onSuccess={fetchGroups}
        />

        <DeleteModal
          group={deleteTarget}
          loading={loading}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}