// Store/teacherStore.ts
import { create } from "zustand";
import { api } from "@/Service/ApiService/api";
import type { Teacher, TeacherState } from "../Store/Teacher/TeacherInterface";
import type { Group } from "@/Store/Group/GroupInterface";

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

  // My groups state
  myGroups: [],
  groupsLoading: false,
  groupsError: null,

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
    set({ totalTeachers, total: totalTeachers }),
  setTotal: (total) => set({ total, totalTeachers: total }),
  setActiveCount: (activeCount) => set({ activeCount, active: activeCount }),
  setActive: (active) => set({ active, activeCount: active }),
  setInactiveCount: (inactiveCount) =>
    set({ inactiveCount, inactive: inactiveCount }),
  setInactive: (inactive) => set({ inactive, inactiveCount: inactive }),

  setSelectedTeacher: (selectedTeacher) => set({ selectedTeacher }),
  setOpenAddDrawer: (openAddDrawer) => set({ openAddDrawer }),
  setOpenEditDrawer: (openEditDrawer) => set({ openEditDrawer }),
  setDeleteDialogOpen: (deleteDialogOpen) => set({ deleteDialogOpen }),

  // My groups setters
  setMyGroups: (myGroups) => set({ myGroups }),
  setGroupsLoading: (groupsLoading) => set({ groupsLoading }),
  setGroupsError: (groupsError) => set({ groupsError }),

  // Teacher yaratish
  createTeacher: async (payload: Partial<Teacher>) => {
    const { teachers } = get();
    set({ loading: true, error: null });
    try {
      const res = await api.post("/teachers", payload);
      
      // Yangi teacher qo'shamiz
      const newTeacher = res.data;
      set({ 
        teachers: [...teachers, newTeacher], 
        loading: false 
      });
      
      return newTeacher;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error creating teacher";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  // Teacher yangilash
  updateTeacher: async (id: string, payload: Partial<Teacher>) => {
    const { teachers } = get();
    set({ loading: true, error: null });
    
    try {
      const res = await api.patch(`/teachers/${id}`, payload);
      
      // Yangilangan teacher'ni listda yangilaymiz
      const updatedTeachers = teachers.map(teacher => 
        teacher.id === id ? { ...teacher, ...res.data } : teacher
      );
      
      set({ 
        teachers: updatedTeachers, 
        loading: false 
      });
      
      return res.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error updating teacher";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  // Barcha teacherlarni olish (FAQAT ACTIVE TEACHERLAR)
  fetchTeachers: async () => {
    const { debouncedSearch, page, limit } = get();

    try {
      set({ loading: true, error: null });
      const res = await api.get("/teachers", {
        params: {
          search: debouncedSearch,
          page,
          limit,
          isActive: true, // FAQAT ACTIVE TEACHERLAR
        },
      });

      const items = res.data.items || [];
      const totalPages = res.data.meta?.pages || 1;
      const total = res.data.meta?.total || 0;
      
      // Faqat active teacherlar bo'lgani uchun:
      const activeCount = items.length; // Barchasi active
      const inactiveCount = 0; // Inactive yo'q

      set({
        teachers: items,
        totalPages,
        totalTeachers: total,
        total: total,
        activeCount: activeCount,
        active: activeCount,
        inactiveCount: inactiveCount,
        inactive: inactiveCount,
        loading: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error loading teachers";

      set({
        error: errorMessage,
        loading: false,
      });

      console.error("Failed to fetch teachers:", err);
    }
  },

  // Statistikani olish (alohida) - BARCHA TEACHERLARNI (active va inactive)
  fetchTeacherStats: async () => {
    try {
      set({ loading: true });
      
      // Barcha teacherlarni olish (active va inactive)
      const allRes = await api.get("/teachers", {
        params: { 
          page: 1, 
          limit: 1000, // Katta limit qo'yamiz, barchasini olish uchun
        },
      });

      // Alohida so'rovlar yuborish (agar kerak bo'lsa)
      const activeRes = await api.get("/teachers", {
        params: { 
          page: 1, 
          limit: 1000,
          isActive: true 
        },
      });
      
      const inactiveRes = await api.get("/teachers", {
        params: { 
          page: 1, 
          limit: 1000,
          isActive: false 
        },
      });

      const totalTeachers = (allRes.data.meta?.total || 0);
      const activeCount = (activeRes.data.meta?.total || activeRes.data.items?.length || 0);
      const inactiveCount = (inactiveRes.data.meta?.total || inactiveRes.data.items?.length || 0);

      set({
        totalTeachers,
        total: totalTeachers,
        activeCount,
        active: activeCount,
        inactiveCount,
        inactive: inactiveCount,
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      set({ loading: false });
    }
  },

  // My groups ni olish
  fetchMyGroups: async () => {
    try {
      set({ groupsLoading: true, groupsError: null });
      const { data } = await api.get<Group[]>("/teachers/my-groups");
      set({ myGroups: data || [], groupsLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch groups";
      set({ groupsError: errorMessage, groupsLoading: false, myGroups: [] });
      console.error("Failed to fetch my groups:", error);
    }
  },

  // Yangilangan teacherlar ro'yxati
  handleUpdated: async () => {
    await get().fetchTeachers();
  },
}));

export default useTeacherStore;