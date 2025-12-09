import { api } from "@/Service/ApiService/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type Role = "admin" | "teacher" | "MANAGER" | "USER";

export type User = {
  id: string;
  email: string;
  avatarUrl: string;
  role: Role;
  mustChangePassword?: boolean;
  firstname: string;
  lastname: string;
  phone: number;
  isActive: boolean;
};

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

// ApiError interfeysini qo'shamiz
export interface ApiError {
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
          if (err && typeof err === "object") {
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
            else if (error.message && typeof error.message === "string") {
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
