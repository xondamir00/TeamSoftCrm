import { create } from "zustand";
import { nanoid } from "nanoid";
import type { AttendanceState, Sheet } from ".";
import { api } from "@/Service/api";

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  sheets: [],
  loading: false,
  saving: false,
  groupName: "",

  // ✅ Bugungi sanani to'g'ri formatda olish
  getLocalDate: () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  fetchSheet: async (groupId, date, lesson) => {
    try {
      set({ loading: true });

      // ✅ Sanani normalize qilamiz - ISO formatda yuboramiz
      const normalizedDate = new Date(date).toISOString().split("T")[0];

      const { data } = await api.get<Sheet>(
        `/teacher/attendance/group/${groupId}`,
        {
          params: { date: normalizedDate, lesson },
        }
      );

      console.log("API Response:", data);

      if (data) {
        set((state) => {
          // Agar serverdan qaytgan sheetId mavjud bo'lsa
          const sheetExists = state.sheets.find(
            (s) => s.sheetId === data.sheetId
          );

          const newSheet: Sheet = sheetExists
            ? data // mavjud bo'lsa, replace qilamiz
            : { ...data, sheetId: data.sheetId || nanoid() }; // unique id bilan

          return {
            sheets: sheetExists
              ? state.sheets.map((s) =>
                  s.sheetId === data.sheetId ? newSheet : s
                )
              : [...state.sheets, newSheet],
          };
        });

        // Group name ni store ga yozamiz
        set({ groupName: data.group?.name || "" });
      }
    } catch (err) {
      console.error("Fetch sheet error:", err);
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
              students: sheet.students.map((st) =>
                st.studentId === studentId ? { ...st, status } : st
              ),
            }
      ),
    }));
  },

  saveSheet: async (sheetId) => {
    const { sheets } = get();
    const sheet = sheets.find((s) => s.sheetId === sheetId);
    if (!sheet) return;

    try {
      set({ saving: true });

      await api.patch(`/teacher/attendance/sheet/${sheetId}`, {
        items: sheet.students.map((s) => ({
          studentId: s.studentId,
          status: s.status,
          comment: s.comment,
        })),
      });

      set((state) => ({
        sheets: state.sheets.map((s) =>
          s.sheetId === sheetId ? { ...s, status: "CLOSED" } : s
        ),
      }));
    } catch (err) {
      console.error("Save sheet error:", err);
    } finally {
      set({ saving: false });
    }
  },
}));
