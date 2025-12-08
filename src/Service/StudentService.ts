import { create } from "zustand";
import { api } from "@/Service/api";
import type { StudentStore } from "@/Store/Student/StudentInterface";
import type { Student } from "@/Store/Student/StudentInterface";

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: [],
  totalPages: 1,
  loading: false,
  error: null,

  fetchStudents: async (search = "", page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/students", {
        params: {
          search,
          page,
          limit,
        },
      });

      set({
        students: res.data.items || [],
        totalPages: res.data.meta?.pages || 1,
        loading: false,
      });
    } catch (err) {
      console.error("Failed to fetch students:", err);
      set({ error: "Studentlarni olishda xatolik yuz berdi", loading: false });
    }
  },

  getStudentById: async (id: number) => {
    try {
      const res = await api.get(`/students/${id}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch student:", err);
      throw err;
    }
  },

  createStudent: async (data: Partial<Student>) => {
    try {
      const res = await api.post("/students", data);
      set({ students: [...get().students, res.data] });
    } catch (err) {
      console.error("Failed to create student:", err);
      throw err;
    }
  },

  updateStudent: async (id: number, data: Partial<Student>) => {
    try {
      const res = await api.patch(`/students/${id}`, data);
      set({
        students: get().students.map((s) => (s.id === id ? res.data : s)),
      });
    } catch (err) {
      console.error("Failed to update student:", err);
      throw err;
    }
  },

  deleteStudent: async (id: number) => {
    try {
      await api.delete(`/students/${id}`);
      set({ students: get().students.filter((s) => s.id !== id) });
    } catch (err) {
      console.error("Failed to delete student:", err);
      throw err;
    }
  },

  restoreStudent: async (id: number) => {
    try {
      const res = await api.patch(`/students/${id}/restore`);
      set({
        students: get().students.map((s) => (s.id === id ? res.data : s)),
      });
    } catch (err) {
      console.error("Failed to restore student:", err);
      throw err;
    }
  },
}));
