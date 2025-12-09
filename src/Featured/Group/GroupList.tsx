"use client";

import { useEffect } from "react";
import { GroupTable } from "@/Featured/Group/GroupTable";
import { DeleteModal } from "@/Featured/Group/DeleteModal";
import { PageHeader } from "@/Featured/Group/PageHeader";
import { GroupStats } from "@/Featured/Group/GroupStatus";
import { GroupModal } from "@/Featured/Group/Groupmodal";
import useGroupStore from "@/Service/GroupService/GroupService";

export default function GroupList() {
  // Store'dan state va actions larni olamiz
  const {
    groups,
    rooms,
    loading,
    search,
    selectedGroup,
    modalOpen,
    groupToDelete,
    setSearch,
    setSelectedGroup,
    setModalOpen,
    setDeleteModalOpen,
    setGroupToDelete,
    fetchGroups,
    fetchRooms,
    deleteGroup,
  } = useGroupStore();

  useEffect(() => {
    fetchGroups();
    fetchRooms();
  }, [fetchGroups, fetchRooms]);

  // Search o'zgarganda guruhlarni yangilash
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGroups();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, fetchGroups]);

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

  // Faqat active guruhlar
  const activeGroups = groups.filter((g) => g.isActive !== false);
  const inactiveGroupsCount = groups.filter((g) => g.isActive === false).length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 overflow-hidden flex flex-col transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          search={search}
          onSearchChange={setSearch}
          onAddGroup={() => {
            setSelectedGroup(null); // Yangi guruh qo'shish
            setModalOpen(true);
          }}
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
            setSelectedGroup(group);
            setModalOpen(true);
          }}
          onDelete={(group) => {
            setGroupToDelete(group);
            setDeleteModalOpen(true);
          }}
          formatTime={formatTime}
        />

        <GroupModal
          isOpen={modalOpen}
          editingGroup={selectedGroup}
          onClose={() => {
            setModalOpen(false);
            setSelectedGroup(null);
          }}
          onSuccess={fetchGroups}
        />

        <DeleteModal
          group={groupToDelete}
          loading={loading}
          onCancel={() => {
            setDeleteModalOpen(false);
            setGroupToDelete(null);
          }}
          onConfirm={async () => {
            if (groupToDelete) {
              await deleteGroup(groupToDelete.id);
            }
          }}
        />
      </div>
    </div>
  );
}
