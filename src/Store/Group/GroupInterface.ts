import { create } from "zustand";
import type { Room } from "../Room/RoomInterface";

export interface Group {
  id: string; // groupId emas
  name: string; // groupName emas
  room?: {
    id: string;
    name: string;
    capacity?: number;
  };
  startTime?: string;
  endTime?: string;
  capacity: number;
  monthlyFee: number;
  schedule?: Schedule;
  daysPattern?: string;
  isActive?: boolean;
  course?: string;
}
// Guruhlarni olish response tipi
export interface GroupsResponse {
  items: Group[]; // Required
  total: number; // Required
  page: number; // Required
  active: number; // Required
  limit: number; // Required
  inactive: number; // Required
}

export interface GroupPayload {
  name: string;
  capacity: number;
  monthlyFee: number;
  daysPattern: string;
  startTime: string;
  endTime: string;
  days?: string[];
  roomId?: string;
}
export interface Schedule {
  mode: "ODD" | "EVEN" | "CUSTOM";
  startTime: string;
  endTime: string;
  days?: string[];
}
export interface GroupModalStore {
  isOpen: boolean;
  editingGroup: Group | null;
  openModal: (group?: Group | null) => void;
  closeModal: () => void;
  onSuccess?: () => void;
  setEditingGroup: (group: Group | null) => void;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "emerald" | "slate";
}

export interface PageHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddGroup: () => void;
}
export interface DeleteModalProps {
  group: Group | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
export interface GroupTableProps {
  groups: Group[];
  rooms: Room[];
  loading: boolean;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  formatTime: (time?: string) => string;
}

export const useGroupModalStore = create<GroupModalStore>((set) => ({
  isOpen: false,
  editingGroup: null,

  openModal: (group = null) =>
    set({
      isOpen: true,
      editingGroup: group,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      editingGroup: null,
    }),

  setEditingGroup: (group) => set({ editingGroup: group }),
}));
