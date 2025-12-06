import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../Service/api";

export type Role = "admin" | "teacher" | "MANAGER" | "USER";

export type User = {
  id: string;
  email: string;
  role: Role;
  mustChangePassword?: boolean;
  firstname: string;
  lastname: string;
  isActive: boolean;
};

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
export interface GroupModalProps {
  isOpen: boolean;
  editingGroup: Group | null;
  onClose: () => void;
  onSuccess: () => void;
}
export interface Group {
  groupId: string;
  groupName: string;
  room?: {
    id: string;
    name: string;
    capacity?: number;
  };
  startTime?: string;
  endTime?: string;
   capacity: number;
  monthlyFee: number;
  schedule?:Schedule

  daysPattern?: string;
}

export type StudentStatus = "PRESENT" | "ABSENT" | "UNKNOWN";

export interface Sheet {
  sheetId: string;
  date: string;
  lesson: number;
  status: "OPEN" | "CLOSED";
  group: {
    id: string;
    name: string;
    room?: { name: string } | null;
  };
  students: Array<{
    studentId: string;
    fullName: string;
    status: StudentStatus;
    comment?: string | null;
  }>;
}

export interface Enrollment {
  id: string;
  studentId: string;
  groupId: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };

  group?: {
    id: string;
    name: string;
  };
}

export interface StudentGroup {
  enrollmentId: string;
  groupId: string;
  name: string;
  room?: {
    id: string;
    name: string;
  };
  teacher?: {
    id: string;
    fullName: string;
  };
  daysPattern?: string;
  startTime?: string;
  endTime?: string;
  monthlyFee?: number;
  joinDate: string;
  status: string;
}

export interface StudentWithGroups {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  startDate?: string;
  address?: string;
  isActive: boolean;
  groups: StudentGroup[];
  totalGroups: number;
}
export interface Schedule {
  mode: 'ODD' | 'EVEN' | 'CUSTOM';
  startTime: string;
  endTime: string;
  days: string[];
}

export interface FormState {
  name: string;
  roomId: string;
  capacity: number;
  monthlyFee: number;
  schedule: Schedule;
}

export interface AddGroupFormProps {
  editingGroup?: Group;
  onSuccess?: () => void;
}

export interface GroupPayload {
  name: string;
  capacity: number;
  monthlyFee: number;
  daysPattern: string;
  startTime: string;
  endTime: string;
  days?: string[];
  roomId?: string;
}
// ApiError interfeysini qo'shamiz
interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
      [key: string]: unknown;
    };
    status?: number;
  };
  message: string;
}

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  booted: boolean;

  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  setBooted: (v: boolean) => void;

  changing: boolean;
  changeError: string | null;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      booted: false,

      login: (token, refreshToken, user) => set({ token, refreshToken, user }),
      logout: () => set({ token: null, refreshToken: null, user: null }),
      setBooted: (v) => set({ booted: v }),

      changing: false,
      changeError: null,
      async changePassword(currentPassword: string, newPassword: string) {
        set({ changing: true, changeError: null });
        
        try {
          const { data } = await api.post("/auth/change-password", {
            currentPassword,
            newPassword,
          });
          
          const u = get().user;
          if (u) {
            set({ user: { ...u, mustChangePassword: false } });
          }
          
          console.log(data.message);
        } catch (err: unknown) {
          let errorMessage = "Parolni almashtirishda xatolik";
          
          // Type-safe error handling
          if (err && typeof err === 'object') {
            const error = err as ApiError;
            
            // 1. API dan kelgan xabar
            if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } 
            // 2. Array formatdagi xatolar
            else if (Array.isArray(error.response?.data)) {
              errorMessage = error.response.data.join(", ");
            }
            // 3. Standart error message
            else if (error.message && typeof error.message === 'string') {
              errorMessage = error.message;
            }
          }
          
          set({ changeError: errorMessage });
          throw err; // Original error'ni throw qilish
        } finally {
          set({ changing: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);