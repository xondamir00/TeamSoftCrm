// Store/enrollmentStore.ts
import { create } from "zustand";
import { api } from "@/Service/ApiService/api";
import type { Enrollment, EnrollmentStore } from "@/Store/Enrollment/EnrollmentInterface";
import type { Student } from "@/Store/Student/StudentInterface";
import type { Group } from "@/Store/Group/GroupInterface";

// Service functions
const enrollmentService = {
  getStudents: () => api.get("/students"),
  getGroups: () => api.get("/groups"),
  getEnrollments: () => api.get("/enrollments"),
  createEnrollment: (data: {
    studentId: number;
    groupId: number;
    joinDate?: string;
  }) => api.post("/enrollments", data),
  updateEnrollment: (id: string, data: Partial<{
    studentId?: number;
    groupId?: number;
    joinDate?: string;
  }>) => api.patch(`/enrollments/${id}`, data),
  deleteEnrollment: (id: string) => api.delete(`/enrollments/${id}`),
};

export const getStudents = () => api.get("/students");

export const getGroups = () => api.get("/groups");

export const getEnrollments = () => api.get("/enrollments");
export const createEnrollment = (data: {
  studentId: number;
  groupId: number;
  joinDate?: string;
}) => api.post("/enrollments", data);

export const useEnrollmentStore = create<EnrollmentStore>((set, get) => ({
  // State
  students: [],
  groups: [],
  enrollments: [],
  loading: false,
  error: null,

  // Setters
  setStudents: (students) => set({ students }),
  setGroups: (groups) => set({ groups }),
  setEnrollments: (enrollments) => set({ enrollments }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Service methods wrapper
  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await enrollmentService.getStudents();
      
      // Backenddan kelgan ma'lumotlarni frontend formatiga o'tkazish
      const students: Student[] = (res.data.items || []).map((item: any) => ({
        id: String(item.id), // number -> string
        fullName: item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim(),
        phone: item.phone || item.user?.phone || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        email: item.email || '',
        isActive: item.isActive !== false,
        dateOfBirth: item.dateOfBirth || '',
        startDate: item.startDate || '',
        address: item.address || '',
        createdAt: item.createdAt || '',
      }));
      
      set({ students, loading: false });
      return students;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch students";
      set({ error: errorMessage, loading: false, students: [] });
      console.error("Failed to fetch students:", err);
      return [];
    }
  },

  fetchGroups: async () => {
    set({ loading: true, error: null });
    try {
      const res = await enrollmentService.getGroups();
      
      // Backenddan kelgan ma'lumotlarni frontend formatiga o'tkazish
      const groups: Group[] = (res.data.items || []).map((item: any) => ({
        id: String(item.id), // number -> string
        name: item.name || '',
        roomId: item.roomId || '',
        room: item.room ? {
          id: String(item.room.id),
          name: item.room.name || '',
          capacity: item.room.capacity || 0,
        } : undefined,
        capacity: item.capacity || 0,
        monthlyFee: item.monthlyFee || 0,
        daysPattern: item.daysPattern || 'ODD',
        startTime: item.startTime || '',
        endTime: item.endTime || '',
        days: item.days || [],
        isActive: item.isActive !== false,
        course: item.course || '',
        createdAt: item.createdAt || '',
      }));
      
      set({ groups, loading: false });
      return groups;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch groups";
      set({ error: errorMessage, loading: false, groups: [] });
      console.error("Failed to fetch groups:", err);
      return [];
    }
  },

  fetchEnrollments: async () => {
    set({ loading: true, error: null });
    try {
      const res = await enrollmentService.getEnrollments();
      
      const enrollments: Enrollment[] = (res.data.items || []).map(
        (item: any) => ({
          id: String(item.id),
          studentId: String(item.studentId),
          groupId: String(item.groupId),
          joinDate: item.joinDate || item.createdAt || new Date().toISOString().split('T')[0],
          status: item.status || 'ACTIVE',
          student: item.student ? {
            id: String(item.student.id),
            fullName: item.student.fullName || `${item.student.firstName || ''} ${item.student.lastName || ''}`.trim(),
            phone: item.student.phone || '',
          } : undefined,
          group: item.group ? {
            id: String(item.group.id),
            name: item.group.name || '',
          } : undefined,
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || '',
        })
      );
      
      set({ enrollments, loading: false });
      return enrollments;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch enrollments";
      set({ error: errorMessage, loading: false, enrollments: [] });
      console.error("Failed to fetch enrollments:", err);
      return [];
    }
  },

  createEnrollment: async (data: { studentId: string; groupId: string; joinDate?: string }) => {
    set({ loading: true, error: null });
    try {
      // Frontend formatidan backend formatiga o'tkazish
      const backendData = {
        studentId: Number(data.studentId), // string -> number
        groupId: Number(data.groupId), // string -> number
        joinDate: data.joinDate,
      };

      const res = await enrollmentService.createEnrollment(backendData);

      // Backend javobini frontend formatiga o'tkazish
      const newEnrollment: Enrollment = {
        id: String(res.data.id),
        studentId: String(res.data.studentId),
        groupId: String(res.data.groupId),
        joinDate: res.data.joinDate || res.data.createdAt || new Date().toISOString().split('T')[0],
        status: res.data.status || 'ACTIVE',
        createdAt: res.data.createdAt || '',
        updatedAt: res.data.updatedAt || '',
      };

      // Yangi enrollmentni ro'yxatga qo'shish
      const updatedEnrollments = [...get().enrollments, newEnrollment];
      set({ enrollments: updatedEnrollments, loading: false });
      
      return newEnrollment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create enrollment";
      set({ error: errorMessage, loading: false });
      console.error("Failed to create enrollment:", err);
      throw err;
    }
  },

  updateEnrollment: async (id: string, data: Partial<{
    studentId?: string;
    groupId?: string;
    joinDate?: string;
    status?: string;
  }>) => {
    set({ loading: true, error: null });
    try {
      // Frontend formatidan backend formatiga o'tkazish
      const backendData: any = {};
      if (data.studentId) backendData.studentId = Number(data.studentId);
      if (data.groupId) backendData.groupId = Number(data.groupId);
      if (data.joinDate) backendData.joinDate = data.joinDate;
      if (data.status) backendData.status = data.status;

      const res = await enrollmentService.updateEnrollment(id, backendData);

      // Yangilangan enrollmentni ro'yxatda yangilash
      const updatedEnrollment: Enrollment = {
        id: String(res.data.id),
        studentId: String(res.data.studentId),
        groupId: String(res.data.groupId),
        joinDate: res.data.joinDate || res.data.createdAt || new Date().toISOString().split('T')[0],
        status: res.data.status || 'ACTIVE',
        createdAt: res.data.createdAt || '',
        updatedAt: res.data.updatedAt || '',
      };

      const updatedEnrollments = get().enrollments.map(enrollment =>
        enrollment.id === id ? { ...enrollment, ...updatedEnrollment } : enrollment
      );
      
      set({ enrollments: updatedEnrollments, loading: false });
      return updatedEnrollment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update enrollment";
      set({ error: errorMessage, loading: false });
      console.error("Failed to update enrollment:", err);
      throw err;
    }
  },

  deleteEnrollment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await enrollmentService.deleteEnrollment(id);

      // O'chirilgan enrollmentni ro'yxatdan olib tashlash
      const updatedEnrollments = get().enrollments.filter(enrollment => enrollment.id !== id);
      
      set({ enrollments: updatedEnrollments, loading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete enrollment";
      set({ error: errorMessage, loading: false });
      console.error("Failed to delete enrollment:", err);
      throw err;
    }
  },

  // Utility method - barcha ma'lumotlarni bir vaqtda yuklash
  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        get().fetchStudents(),
        get().fetchGroups(),
        get().fetchEnrollments(),
      ]);
      set({ loading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch all data";
      set({ error: errorMessage, loading: false });
      console.error("Failed to fetch all data:", err);
    }
  },
}));

// Export service functions separately if needed
export { enrollmentService };