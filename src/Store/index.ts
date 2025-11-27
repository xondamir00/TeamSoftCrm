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
export type StudentStatus = "PRESENT" | "ABSENT" | "UNKNOWN";

export interface Student {
  studentId: string;
  fullName: string;
  status: StudentStatus;
  comment?: string | null;
}

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
  students: Student[];
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
export interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl?: string;
  monthlySalary?: number;
  isActive: boolean;
}

interface ManagerState {
  managers: Manager[];
  trashManagers: Manager[];
  loading: boolean;
  error: string | null;

  fetchManagers: () => Promise<void>;
  fetchTrashManagers: () => Promise<void>;
  deleteManager: (id: string) => Promise<void>;
  restoreManager: (id: string) => Promise<void>;
}

export const useManagerStore = create<ManagerState>((set, get) => ({
  managers: [],
  trashManagers: [],
  loading: false,
  error: null,

  // ACTIVE MANAGERS LIST
  fetchManagers: async () => {
    try {
      set({ loading: true });
      const { data } = await api.get("/managers", {
        params: { isActive: true },
      });
      set({ managers: data.items || [], loading: false });
    } catch (e: any) {
      set({
        loading: false,
        error: e.response?.data?.message || "Failed to load managers",
      });
    }
  },

  // TRASH LIST
  fetchTrashManagers: async () => {
    try {
      set({ loading: true });
      const { data } = await api.get("/managers", {
        params: { isActive: false },
      });
      set({ trashManagers: data.items || [], loading: false });
    } catch (e: any) {
      set({
        loading: false,
        error: e.response?.data?.message || "Failed to load trash managers",
      });
    }
  },

  // MOVE TO TRASH
  deleteManager: async (id: string) => {
    try {
      await api.delete(`/managers/${id}`);
      await get().fetchManagers();
      await get().fetchTrashManagers();
    } catch (e: any) {
      set({
        error: e.response?.data?.message || "Failed to delete manager",
      });
    }
  },

  // RESTORE
  restoreManager: async (id: string) => {
    try {
      await api.patch(`/managers/${id}`, { isActive: true });
      await get().fetchManagers();
      await get().fetchTrashManagers();
    } catch (e: any) {
      set({
        error: e.response?.data?.message || "Failed to restore manager",
      });
    }
  },
}));

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
