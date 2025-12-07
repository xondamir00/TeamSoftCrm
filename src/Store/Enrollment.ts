import { create } from "zustand";
import { api } from "@/Service/api";

export interface Student {
  id: string; // Frontend uchun string
  fullName: string;
  phone?: string;
}

export interface Group {
  id: string; // Frontend uchun string
  name: string;
}

export interface Enrollment {
  id: string; // Frontend uchun string
  studentId: string; // Frontend uchun string
  groupId: string; // Frontend uchun string
  joinDate?: string;
}

interface EnrollmentStore {
  students: Student[];
  groups: Group[];
  enrollments: Enrollment[];
  fetchStudents: () => Promise<Student[]>;
  fetchGroups: () => Promise<Group[]>;
  fetchEnrollments: () => Promise<Enrollment[]>;
  createEnrollment: (data: { 
    studentId: string; 
    groupId: string; 
    joinDate?: string 
  }) => Promise<Enrollment>;
}

export const useEnrollmentStore = create<EnrollmentStore>((set, get) => ({
  students: [],
  groups: [],
  enrollments: [],

  fetchStudents: async () => {
    try {
      const res = await api.get("/students");
      // Backenddan kelgan ma'lumotlarni frontend formatiga o'tkazish
      const students: Student[] = (res.data.items || []).map((item: any) => ({
        id: String(item.id), // number -> string
        fullName: item.fullName || `${item.firstName} ${item.lastName}`,
        phone: item.phone || item.user?.phone,
      }));
      set({ students });
      return students;
    } catch (err) {
      console.error("Failed to fetch students:", err);
      return [];
    }
  },

  fetchGroups: async () => {
    try {
      const res = await api.get("/groups");
      // Backenddan kelgan ma'lumotlarni frontend formatiga o'tkazish
      const groups: Group[] = (res.data.items || []).map((item: any) => ({
        id: String(item.id), // number -> string
        name: item.name,
      }));
      set({ groups });
      return groups;
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      return [];
    }
  },

  fetchEnrollments: async () => {
    try {
      const res = await api.get("/enrollments");
      const enrollments: Enrollment[] = (res.data.items || []).map((item: any) => ({
        id: String(item.id),
        studentId: String(item.studentId),
        groupId: String(item.groupId),
        joinDate: item.joinDate,
      }));
      set({ enrollments });
      return enrollments;
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
      return [];
    }
  },

  createEnrollment: async (data) => {
    try {
      // Frontend formatidan backend formatiga o'tkazish
      const backendData = {
        studentId: Number(data.studentId), // string -> number
        groupId: Number(data.groupId), // string -> number
        joinDate: data.joinDate,
      };

      const res = await api.post("/enrollments", backendData);
      
      // Backend javobini frontend formatiga o'tkazish
      const newEnrollment: Enrollment = {
        id: String(res.data.id),
        studentId: String(res.data.studentId),
        groupId: String(res.data.groupId),
        joinDate: res.data.joinDate,
      };

      set({ enrollments: [...get().enrollments, newEnrollment] });
      return newEnrollment;
    } catch (err) {
      console.error("Failed to create enrollment:", err);
      throw err;
    }
  },
}));