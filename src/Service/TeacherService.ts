// Store/teacherStore.ts
import { create } from "zustand";
import { api } from "@/Service/api";
import type { Teacher, TeacherState } from "../Store/Teacher/TeacherInterface";

const useTeacherStore = create<TeacherState>((set, get) => ({
  // Initial state
  search: "",
  debouncedSearch: "",
  page: 1,
  limit: 10,

  teachers: [],
  loading: false,
  error: null,
  totalPages: 1,

  // Stats - ikkala nom bilan
  totalTeachers: 0,
  total: 0,
  activeCount: 0,
  active: 0,
  inactiveCount: 0,
  inactive: 0,

  selectedTeacher: null,
  openAddDrawer: false,
  openEditDrawer: false,
  deleteDialogOpen: false,

  // Setters
  setSearch: (search) => set({ search }),
  setDebouncedSearch: (debouncedSearch) => set({ debouncedSearch }),
  setPage: (page) => set({ page }),
  setTeachers: (teachers) => set({ teachers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setTotalPages: (totalPages) => set({ totalPages }),

  // Stats setters - ikkala nom bilan
  setTotalTeachers: (totalTeachers) =>
    set({ totalTeachers, total: totalTeachers }), // Ikkalasini ham yangilaymiz
  setTotal: (total) => set({ total, totalTeachers: total }), // Ikkalasini ham yangilaymiz
  setActiveCount: (activeCount) => set({ activeCount, active: activeCount }), // Ikkalasini ham yangilaymiz
  setActive: (active) => set({ active, activeCount: active }), // Ikkalasini ham yangilaymiz
  setInactiveCount: (inactiveCount) =>
    set({ inactiveCount, inactive: inactiveCount }), // Ikkalasini ham yangilaymiz
  setInactive: (inactive) => set({ inactive, inactiveCount: inactive }), // Ikkalasini ham yangilaymiz

  setSelectedTeacher: (selectedTeacher) => set({ selectedTeacher }),
  setOpenAddDrawer: (openAddDrawer) => set({ openAddDrawer }),
  setOpenEditDrawer: (openEditDrawer) => set({ openEditDrawer }),
  setDeleteDialogOpen: (deleteDialogOpen) => set({ deleteDialogOpen }),

  // teacherStore.ts ichida
  createTeacher: async (payload: Partial<Teacher>) => {
    const { teachers } = get();
    set({ loading: true, error: null });
    try {
      const res = await api.post("/teachers", payload);
      set({ teachers: [...teachers, res.data], loading: false });
      return res.data; // muvaffaqiyatli qo'shilgan teacherni return qilamiz
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error creating teacher";
      set({ error: errorMessage, loading: false });
      throw err; // tashqi komponentda catch qilish uchun
    }
  },

  // API actions
  fetchTeachers: async () => {
    const { debouncedSearch, page, limit } = get();

    try {
      set({ loading: true, error: null });
      const res = await api.get("/teachers", {
        params: {
          search: debouncedSearch,
          page,
          limit,
          isActive: true,
        },
      });

      const items = res.data.items || [];
      const totalPages = res.data.meta?.pages || 1;
      const totalTeachers = res.data.meta?.total || 0;
      const activeCount = items.filter((t: Teacher) => t.isActive).length;

      set({
        teachers: items,
        totalPages,
        totalTeachers,
        total: totalTeachers, // total ni ham yangilaymiz
        activeCount,
        active: activeCount, // active ni ham yangilaymiz
        loading: false,
      });
    } catch (err) {
      // err o'zgaruvchisini ishlatish
      const errorMessage =
        err instanceof Error ? err.message : "Error loading teachers";

      set({
        error: errorMessage,
        loading: false,
      });

      // Console'ga ham chiqarish
      console.error("Failed to fetch teachers:", err);
    }
  },

  fetchTeacherStats: async () => {
    try {
      const activeRes = await api.get("/teachers", {
        params: { limit: 1000, isActive: true },
      });
      const inactiveRes = await api.get("/teachers", {
        params: { limit: 1000, isActive: false },
      });

      const totalTeachers =
        activeRes.data.items.length + inactiveRes.data.items.length;
      const activeCount = activeRes.data.items.length;
      const inactiveCount = inactiveRes.data.items.length;

      set({
        totalTeachers,
        total: totalTeachers, // total ni ham yangilaymiz
        activeCount,
        active: activeCount, // active ni ham yangilaymiz
        inactiveCount,
        inactive: inactiveCount, // inactive ni ham yangilaymiz
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  },

  handleUpdated: async () => {
    await Promise.all([get().fetchTeachers(), get().fetchTeacherStats()]);
  },
}));

export default useTeacherStore;
