import { create } from "zustand";
import { api } from "@/Service/api";

export interface Student {
  id: string; // yoki number
  fullName: string;
  phone?: string;
}


export interface Group {
  id: number; // string -> number
  name: string;
}

export interface Enrollment {
  id: number; // string -> number
  studentId: number; // string -> number
  groupId: number; // string -> number
  joinDate?: string;
}

interface EnrollmentStore {
  students: Student[];
  groups: Group[];
  enrollments: Enrollment[];
  fetchStudents: () => Promise<Student[]>;
  fetchGroups: () => Promise<Group[]>;
  fetchEnrollments: () => Promise<Enrollment[]>;
  createEnrollment: (data: { studentId: string; groupId: string; joinDate?: string }) => Promise<Enrollment>;
}

export const useEnrollmentStore = create<EnrollmentStore>((set, get) => ({
  students: [],
  groups: [],
  enrollments: [],

  fetchStudents: async () => {
    try {
      const res = await api.get("/students");
      set({ students: res.data.items ?? [] });
      return res.data.items ?? [];
    } catch (err) {
      console.error("Failed to fetch students:", err);
      return [];
    }
  },

  fetchGroups: async () => {
    try {
      const res = await api.get("/groups");
      set({ groups: res.data.items ?? [] });
      return res.data.items ?? [];
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      return [];
    }
  },

  fetchEnrollments: async () => {
    try {
      const res = await api.get("/enrollments");
      set({ enrollments: res.data.items ?? [] });
      return res.data.items ?? [];
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
      return [];
    }
  },

  createEnrollment: async (data) => {
    try {
      const res = await api.post("/enrollments", data);
      set({ enrollments: [...get().enrollments, res.data] });
      return res.data;
    } catch (err) {
      console.error("Failed to create enrollment:", err);
      throw err;
    }
  },
}));
