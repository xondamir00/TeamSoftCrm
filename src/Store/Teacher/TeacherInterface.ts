// Store/Teacher/TeacherInterface.ts

import type { Group } from "@/Store/Group/GroupInterface";

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
export interface TeachingAssignmentState {
  // State
  assignments: TeacherAssignment[];
  loading: boolean;
  error: string | null;
  teachers: any[]; // Form uchun teacherlar ro'yxati
  groups: any[]; // Form uchun guruhlar ro'yxati
  formLoading: boolean; // Form yuklanishi uchun

  // Setters
  setAssignments: (assignments: TeacherAssignment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTeachers: (teachers: any[]) => void;
  setGroups: (groups: any[]) => void;
  setFormLoading: (loading: boolean) => void;

  // Actions - CRUD operations
  fetchAssignments: () => Promise<void>;

  // Form uchun metodlar
  fetchFormData: () => Promise<void>; // Teacher va group ma'lumotlarini olish
  createAssignment: (payload: {
    teacherId: string;
    groupId: string;
    role?: string;
    note?: string;
    fromDate?: string;
    toDate?: string;
    inheritSchedule?: boolean;
    daysPatternOverride?: string;
    startTimeOverride?: string;
    endTimeOverride?: string;
  }) => Promise<TeacherAssignment>;

  updateAssignment: (
    id: string,
    payload: Partial<{
      role?: string;
      note?: string;
      isActive?: boolean;
    }>
  ) => Promise<TeacherAssignment>;

  deleteAssignment: (id: string) => Promise<void>;
}
export interface TeachingAssignmentFormProps {
  onSuccess: () => void;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  groupId: string;
  role: string;
  isActive: boolean;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  group?: {
    id: string;
    name: string;
  };
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

export interface TeacherDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface AddTeacherDrawerProps extends TeacherDrawerProps {
  onAdded: () => void;
}

export interface UpdateTeacherDrawerProps extends TeacherDrawerProps {
  teacherId: string;
  onUpdated: () => void;
}
