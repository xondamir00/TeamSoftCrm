// Store/teacherStore.ts
import { create } from 'zustand';
import { api } from '@/Service/api';
import type { Teacher } from '.';

interface TeacherState {
  // Search va pagination state'lari
  search: string;
  debouncedSearch: string;
  page: number;
  limit: number;
  
  // Teachers list state'lari
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  
  // Stats state'lari - ikkala nom ham saqlansin
  totalTeachers: number;
  total: number; // TeacherStats uchun qo'shimcha
  activeCount: number;
  active: number; // TeacherStats uchun qo'shimcha
  inactiveCount: number;
  inactive: number; // TeacherStats uchun qo'shimcha
  
  // Modal state'lari
  selectedTeacher: Teacher | null;
  openAddDrawer: boolean;
  openEditDrawer: boolean;
  deleteDialogOpen: boolean;

  // Actions
  setSearch: (search: string) => void;
  setDebouncedSearch: (debouncedSearch: string) => void;
  setPage: (page: number) => void;
  setTeachers: (teachers: Teacher[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTotalPages: (totalPages: number) => void;
  
  // Stats actions - ikkala nom uchun ham
  setTotalTeachers: (totalTeachers: number) => void;
  setTotal: (total: number) => void;
  setActiveCount: (activeCount: number) => void;
  setActive: (active: number) => void;
  setInactiveCount: (inactiveCount: number) => void;
  setInactive: (inactive: number) => void;
  
  // Modal actions
  setSelectedTeacher: (teacher: Teacher | null) => void;
  setOpenAddDrawer: (open: boolean) => void;
  setOpenEditDrawer: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  
  // API actions
  fetchTeachers: () => Promise<void>;
  fetchTeacherStats: () => Promise<void>;
  handleUpdated: () => Promise<void>;
}

const useTeacherStore = create<TeacherState>((set, get) => ({
  // Initial state
  search: '',
  debouncedSearch: '',
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
  setTotalTeachers: (totalTeachers) => set({ totalTeachers, total: totalTeachers }), // Ikkalasini ham yangilaymiz
  setTotal: (total) => set({ total, totalTeachers: total }), // Ikkalasini ham yangilaymiz
  setActiveCount: (activeCount) => set({ activeCount, active: activeCount }), // Ikkalasini ham yangilaymiz
  setActive: (active) => set({ active, activeCount: active }), // Ikkalasini ham yangilaymiz
  setInactiveCount: (inactiveCount) => set({ inactiveCount, inactive: inactiveCount }), // Ikkalasini ham yangilaymiz
  setInactive: (inactive) => set({ inactive, inactiveCount: inactive }), // Ikkalasini ham yangilaymiz
  
  setSelectedTeacher: (selectedTeacher) => set({ selectedTeacher }),
  setOpenAddDrawer: (openAddDrawer) => set({ openAddDrawer }),
  setOpenEditDrawer: (openEditDrawer) => set({ openEditDrawer }),
  setDeleteDialogOpen: (deleteDialogOpen) => set({ deleteDialogOpen }),

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
          isActive: true 
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
        loading: false 
      });
    }catch (err) {
    // err o'zgaruvchisini ishlatish
    const errorMessage = err instanceof Error 
      ? err.message 
      : "Error loading teachers";
    
    set({ 
      error: errorMessage, 
      loading: false 
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

      const totalTeachers = activeRes.data.items.length + inactiveRes.data.items.length;
      const activeCount = activeRes.data.items.length;
      const inactiveCount = inactiveRes.data.items.length;

      set({ 
        totalTeachers, 
        total: totalTeachers, // total ni ham yangilaymiz
        activeCount, 
        active: activeCount, // active ni ham yangilaymiz
        inactiveCount,
        inactive: inactiveCount // inactive ni ham yangilaymiz
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  },

  handleUpdated: async () => {
    await Promise.all([
      get().fetchTeachers(),
      get().fetchTeacherStats()
    ]);
  },
}));

export default useTeacherStore;