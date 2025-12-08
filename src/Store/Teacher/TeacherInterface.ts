export interface Teacher {
  id: string;
  isActive: boolean;
  fullName?: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  photoUrl?: string | null;
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

export interface AddTeacherDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}
