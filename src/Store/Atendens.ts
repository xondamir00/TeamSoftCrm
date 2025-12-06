// stores/attendanceStore.ts
import { create } from "zustand";
import { api } from "@/Service/api";
import type { Sheet, StudentStatus, Group } from "./index";

interface AttendanceState {
  sheets: Sheet[];
  group: Group | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  editingSheetId: string | null;
  editingStudentId: string | null;
  comment: string;

  // Actions
  fetchGroupInfo: (groupId: string) => Promise<void>;
  getOrCreateSheet: (groupId: string, date: string, lesson: number) => Promise<void>;
  updateLocalStatus: (sheetId: string, studentId: string, status: StudentStatus) => void;
  setEditingComment: (sheetId: string, studentId: string) => void;
  saveComment: () => void;
  updateCommentText: (comment: string) => void;
  saveSheet: (sheetId: string) => Promise<void>;
  deleteSheet: (sheetId: string) => Promise<void>;
  clearError: () => void;
  resetEditing: () => void;
}
export interface SheetHeaderProps {
  sheet: Sheet;
  stats: {
    present: number;
    absent: number;
    total: number;
  };
  onSave: (sheetId: string) => void;
  onDelete: (sheetId: string) => void;
  saving: boolean;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  sheets: [],
  group: null,
  loading: false,
  saving: false,
  error: null,
  editingSheetId: null,
  editingStudentId: null,
  comment: "",

  fetchGroupInfo: async (groupId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get<Group>(`/groups/${groupId}`);
      set({ group: data });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Guruh ma'lumotlarini olishda xatolik" 
      });
    } finally {
      set({ loading: false });
    }
  },

  getOrCreateSheet: async (groupId, date, lesson) => {
    try {
      set({ loading: true, error: null });

      const { data } = await api.get<Sheet>(`/teacher/attendance/group/${groupId}`, {
        params: { date, lesson }
      });

      set((state) => {
        const exists = state.sheets.some(s => s.sheetId === data.sheetId);
        if (exists) {
          return {
            sheets: state.sheets.map(s => 
              s.sheetId === data.sheetId ? data : s
            )
          };
        }
        return { sheets: [...state.sheets, data] };
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Sheet yaratish/yuklashda xatolik" 
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateLocalStatus: (sheetId, studentId, status) => {
    set((state) => ({
      sheets: state.sheets.map((sheet) =>
        sheet.sheetId !== sheetId
          ? sheet
          : {
              ...sheet,
              students: sheet.students.map((student) =>
                student.studentId === studentId
                  ? { ...student, status }
                  : student
              ),
            }
      ),
    }));
  },

  setEditingComment: (sheetId, studentId) => {
    const { sheets } = get();
    const sheet = sheets.find(s => s.sheetId === sheetId);
    const student = sheet?.students.find(s => s.studentId === studentId);
    
    set({
      editingSheetId: sheetId,
      editingStudentId: studentId,
      comment: student?.comment || ""
    });
  },

  saveComment: () => {
    const { editingSheetId, editingStudentId, comment, sheets } = get();
    
    if (!editingSheetId || !editingStudentId) return;

    set({
      sheets: sheets.map((sheet) =>
        sheet.sheetId !== editingSheetId
          ? sheet
          : {
              ...sheet,
              students: sheet.students.map((student) =>
                student.studentId === editingStudentId
                  ? { ...student, comment }
                  : student
              ),
            }
      ),
      editingSheetId: null,
      editingStudentId: null,
      comment: ""
    });
  },

  updateCommentText: (comment) => {
    set({ comment });
  },

  saveSheet: async (sheetId) => {
    const { sheets } = get();
    const sheet = sheets.find((s) => s.sheetId === sheetId);
    if (!sheet) {
      set({ error: "Sheet topilmadi" });
      return;
    }

    try {
      set({ saving: true, error: null });

      await api.patch(`/teacher/attendance/sheet/${sheetId}`, {
        items: sheet.students.map((student) => ({
          studentId: student.studentId,
          status: student.status,
          comment: student.comment || "",
        })),
      });

      set((state) => ({
        sheets: state.sheets.map((s) =>
          s.sheetId === sheetId ? { ...s, status: "CLOSED" } : s
        ),
      }));
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Sheet saqlashda xatolik" 
      });
      throw err;
    } finally {
      set({ saving: false });
    }
  },

  deleteSheet: async (sheetId) => {
    try {
      await api.delete(`/teacher/attendance/sheet/${sheetId}`);
      
      set((state) => ({
        sheets: state.sheets.filter((s) => s.sheetId !== sheetId),
      }));
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Sheet o'chirishda xatolik" 
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),

  resetEditing: () => set({ 
    editingSheetId: null, 
    editingStudentId: null, 
    comment: "" 
  }),
}));