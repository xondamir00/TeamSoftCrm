// Store/Teacher/TeacherInterface.ts
import type { Group } from "@/Store";

export interface Teacher {
  id: string;
  isActive: boolean;
  fullName?: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  photoUrl?: string | null;
   monthlySalary?: number | null; 
  percentShare?: number | null;  
}

export interface CreateTeacherPayload {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  photoUrl?: string | null;
  monthlySalary?: number | null;
  percentShare?: number | null;
}

export interface DeleteTeacherProps {
  teacher: Teacher | null;
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export interface TeacherState {
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
  total: number;
  activeCount: number;
  active: number;
  inactiveCount: number;
  inactive: number;

  // Modal state'lari
  selectedTeacher: Teacher | null;
  openAddDrawer: boolean;
  openEditDrawer: boolean;
  deleteDialogOpen: boolean;

  // My groups state'lari
  myGroups: Group[];
  groupsLoading: boolean;
  groupsError: string | null;

  // Setters
  setSearch: (search: string) => void;
  setDebouncedSearch: (debouncedSearch: string) => void;
  setPage: (page: number) => void;
  setTeachers: (teachers: Teacher[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTotalPages: (totalPages: number) => void;

  // Stats setters
  setTotalTeachers: (totalTeachers: number) => void;
  setTotal: (total: number) => void;
  setActiveCount: (activeCount: number) => void;
  setActive: (active: number) => void;
  setInactiveCount: (inactiveCount: number) => void;
  setInactive: (inactive: number) => void;

  // Modal setters
  setSelectedTeacher: (teacher: Teacher | null) => void;
  setOpenAddDrawer: (open: boolean) => void;
  setOpenEditDrawer: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;

  // My groups setters
  setMyGroups: (myGroups: Group[]) => void;
  setGroupsLoading: (groupsLoading: boolean) => void;
  setGroupsError: (groupsError: string | null) => void;

  // API actions
  createTeacher: (payload: Partial<Teacher>) => Promise<Teacher>;
  updateTeacher: (id: string, payload: Partial<Teacher>) => Promise<Teacher>;
  fetchTeachers: () => Promise<void>;
  fetchTeacherStats: () => Promise<void>;
  fetchMyGroups: () => Promise<void>;
  handleUpdated: () => Promise<void>;
}

export interface AddTeacherDrawerProps {
  open: boolean;
  onClose: () => void;
  teacherId: string;
  onUpdated: () => void;
  onAdded: () => void;
}