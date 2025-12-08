import type { CreateRoomPayload, Room, UpdateRoomPayload } from "@/Store/Room/RoomStore";
import { api } from "./api";

export const RoomService = {
  async getAll() {
    const { data } = await api.get<Room[]>("/rooms");
    return data;
  },

  async getListPaginated() {
    const { data } = await api.get<{ items: Room[] }>("/rooms");
    return data.items;
  },

  async create(payload: CreateRoomPayload) {
    const { data } = await api.post("/rooms", payload);
    return data;
  },

  async update(id: string, payload: UpdateRoomPayload) {
    const { data } = await api.patch(`/rooms/${id}`, payload);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.patch(`/rooms/${id}`, { isActive: false });
    return data;
  },
};