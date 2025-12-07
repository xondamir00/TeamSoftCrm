import { create } from 'zustand';
import type { Group } from '@/Store/group';

interface GroupModalStore {
  isOpen: boolean;
  editingGroup: Group | null;
  openModal: (group?: Group | null) => void;
  closeModal: () => void;
  setEditingGroup: (group: Group | null) => void;
}

export const useGroupModalStore = create<GroupModalStore>((set) => ({
  isOpen: false,
  editingGroup: null,
  
  openModal: (group = null) => set({ 
    isOpen: true, 
    editingGroup: group 
  }),
  
  closeModal: () => set({ 
    isOpen: false, 
    editingGroup: null 
  }),
  
  setEditingGroup: (group) => set({ editingGroup: group }),
}));