// @/Store/group.ts
import { api } from "@/Service/api";

// Xona tipi
export interface Room {
  id: string;
  name: string;
}

// Guruh tipi
export interface Group {
  id: string;
  name: string;
  roomId?: string;
  capacity?: number;
  monthlyFee?: number;
  daysPattern?: "ODD" | "EVEN" | "CUSTOM";
  startTime?: string;
  endTime?: string;
  days?: string[];
  isActive?: boolean;
  createdAt: string;
}

// Guruhlarni olish response tipi
export interface GroupsResponse {
  items: Group[];
  total: number;
  page: number;
  limit: number;
}

// Guruh yaratish / update payload tipi
export interface GroupPayload {
  name: string;
  roomId?: string;
  capacity: number;
  monthlyFee: number;
  daysPattern: "ODD" | "EVEN" | "CUSTOM";
  startTime: string;
  endTime: string;
  days?: string[];
}

// GroupService barcha CRUD va room olish funksiyalari bilan
export const GroupService = {
  // Guruhlarni olish
  getGroups: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<GroupsResponse> => {
    const response = await api.get("/groups", { params });
    return response.data;
  },

  // Xonalarni olish
  getRooms: async (): Promise<Room[]> => {
    const response = await api.get("/rooms");
    return response.data;
  },

  // Guruh yaratish
  createGroup: async (payload: GroupPayload): Promise<Group> => {
    const response = await api.post("/groups", payload);
    return response.data;
  },

  // Guruhni yangilash
  updateGroup: async (
    id: string,
    payload: Partial<GroupPayload>
  ): Promise<Group> => {
    const response = await api.patch(`/groups/${id}`, payload);
    return response.data;
  },

  // Guruhni o'chirish
  deleteGroup: async (id: string): Promise<void> => {
    await api.delete(`/groups/${id}`);
  },
};
