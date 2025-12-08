// @/Store/groupStore.ts
import { create } from "zustand";
import { api } from "@/Service/ApiService/api";
import type { Group, GroupPayload } from "@/Store/Group/GroupInterface";
import type { Room } from "@/Store/room";



// Guruh state interface
export interface GroupState {
  // State properties
  groups: Group[];
  rooms: Room[];
  loading: boolean;
  error: string | null;
  search: string;
  page: number;
  limit: number;
  totalPages: number;
  totalGroups: number;
  
  // UI state
  selectedGroup: Group | null;
  modalOpen: boolean;
  deleteModalOpen: boolean;
  groupToDelete: Group | null;
  
  // Setters
  setGroups: (groups: Group[]) => void;
  setRooms: (rooms: Room[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setSelectedGroup: (group: Group | null) => void;
  setModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
  setGroupToDelete: (group: Group | null) => void;
  
  // Actions
  fetchGroups: () => Promise<void>;
  fetchRooms: () => Promise<void>;
  createGroup: (payload: GroupPayload) => Promise<Group>;
  updateGroup: (id: string, payload: Partial<GroupPayload>) => Promise<Group>;
  deleteGroup: (id: string) => Promise<void>;
}


const useGroupStore = create<GroupState>((set, get) => ({
  // Initial state
  groups: [],
  rooms: [],
  loading: false,
  error: null,
  search: "",
  page: 1,
  limit: 50,
  totalPages: 1,
  totalGroups: 0,
  
  // UI state
  selectedGroup: null,
  modalOpen: false,
  deleteModalOpen: false,
  groupToDelete: null,
  
  // Setters
  setGroups: (groups) => set({ groups }),
  setRooms: (rooms) => set({ rooms }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearch: (search) => set({ search }),
  setPage: (page) => set({ page }),
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  setModalOpen: (modalOpen) => set({ modalOpen }),
  setDeleteModalOpen: (deleteModalOpen) => set({ deleteModalOpen }),
  setGroupToDelete: (groupToDelete) => set({ groupToDelete }),
  
  // Guruhlarni olish
  fetchGroups: async () => {
    const { search, page, limit } = get();
    set({ loading: true, error: null });
    
    try {
      const response = await api.get("/groups", {
        params: { 
          page, 
          limit, 
          search: search || undefined,
          isActive: true // Faqat active guruhlar
        },
      });
      
      const items = response.data.items || [];
      const total = response.data.meta?.total || 0;
      const totalPages = response.data.meta?.pages || 1;
      
      set({ 
        groups: items,
        totalGroups: total,
        totalPages,
        loading: false 
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch groups";
      set({ 
        error: errorMessage, 
        loading: false,
        groups: []
      });
      console.error("Error fetching groups:", err);
    }
  },
  
  // Xonalarni olish
  fetchRooms: async () => {
    set({ loading: true });
    
    try {
      const response = await api.get("/rooms");
      const rooms = response.data || [];
      
      set({ 
        rooms,
        loading: false 
      });
    } catch (err: any) {
      console.error("Error fetching rooms:", err);
      set({ 
        rooms: [], 
        loading: false 
      });
    }
  },
  
  // Guruh yaratish
  createGroup: async (payload: GroupPayload) => {
    const { groups } = get();
    set({ loading: true, error: null });
    
    try {
      const response = await api.post("/groups", payload);
      const newGroup = response.data;
      
      // Yangi guruhni ro'yxatga qo'shamiz
      set({ 
        groups: [...groups, newGroup],
        loading: false,
        modalOpen: false // Modalni yopamiz
      });
      
      return newGroup;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create group";
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw err;
    }
  },
  
  // Guruhni yangilash
  updateGroup: async (id: string, payload: Partial<GroupPayload>) => {
    const { groups } = get();
    set({ loading: true, error: null });
    
    try {
      const response = await api.patch(`/groups/${id}`, payload);
      const updatedGroup = response.data;
      
      // Yangilangan guruhni ro'yxatda yangilaymiz
      const updatedGroups = groups.map(group => 
        group.id === id ? { ...group, ...updatedGroup } : group
      );
      
      set({ 
        groups: updatedGroups,
        loading: false,
        modalOpen: false, // Modalni yopamiz
        selectedGroup: null // SelectedGroup ni null qilamiz
      });
      
      return updatedGroup;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update group";
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw err;
    }
  },
  
  // Guruhni o'chirish
  deleteGroup: async (id: string) => {
    const { groups } = get();
    set({ loading: true, error: null });
    
    try {
      await api.delete(`/groups/${id}`);
      
      // O'chirilgan guruhni ro'yxatdan olib tashlaymiz
      const updatedGroups = groups.filter(group => group.id !== id);
      
      set({ 
        groups: updatedGroups,
        loading: false,
        deleteModalOpen: false, // Delete modalni yopamiz
        groupToDelete: null // groupToDelete ni null qilamiz
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete group";
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw err;
    }
  },
}));

export default useGroupStore;