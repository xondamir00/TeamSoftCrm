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
  daysPattern?: string;
}

export interface Student {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  dateOfBirth?: string;
  startDate?: string;
  createdAt: string;
}
export interface Enrollment {
  id: string;
  studentId: string;
  groupId: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  // backend join qaytarsa optional
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
      async changePassword(currentPassword, newPassword) {
        set({ changing: true, changeError: null });
        try {
          const { data } = await api.post("/auth/change-password", {
            currentPassword,
            newPassword,
          });
          const u = get().user;
          if (u) set({ user: { ...u, mustChangePassword: false } });
          console.log(data.message);
        } catch (err: any) {
          const msg =
            err?.response?.data?.message ||
            (Array.isArray(err?.response?.data)
              ? err.response.data.join(", ")
              : "") ||
            "Parolni almashtirishda xatolik";
          set({ changeError: msg });
          throw err;
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
