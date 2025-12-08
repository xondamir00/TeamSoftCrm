import type { Room } from "@/Store/Room/RoomInterface";
import { api } from "./ApiService/api";
import type { Student } from "@/Store/Student/StudentInterface";


export const trashTeacherService = {
  async getAll() {
    const response = await api.get("/teachers", {
      params: { isActive: false },
    });
    return response.data;
  },

  async restore(id: string) {
    return api.patch(`/teachers/${id}`, {
      isActive: true,
    });
  },

}
export const trashStudentService = {
  async getAll(): Promise<{ items: Student[] }> {
    const response = await api.get("/students", {
      params: { isActive: false },
    });
    return response.data;
  },

  async restore(id: string): Promise<void> {
    await api.patch(`/students/${id}/restore`);
  }}
  export const trashRoomService = {
  async getAll(): Promise<{ items: Room[] }> {
    const response = await api.get("/rooms", {
      params: { isActive: false },
    });
    return { items: response.data };
  },

  async restore(id: string): Promise<void> {
    await api.patch(`/rooms/${id}`, { isActive: true });
  },
};
