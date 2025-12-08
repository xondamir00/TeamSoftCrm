import { api } from "@/Service/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudentGroup } from "./Student/StudentInterface";
import type { StudentFinanceSummary } from "./finance";

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

export interface GroupModalProps {
  isOpen: boolean;
  editingGroup: Group | null;
  onClose: () => void;
  onSuccess: () => void;
}
export interface Group {
  id: string; // groupId emas
  name: string; // groupName emas
  room?: {
    id: string;
    name: string;
    capacity?: number;
  };
  startTime?: string;
  endTime?: string;
  capacity: number;
  monthlyFee: number;
  schedule?: Schedule;
  daysPattern?: string;
  isActive?: boolean;
  course?: string;
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
  mode: "ODD" | "EVEN" | "CUSTOM";
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
// src/finance/types/finance.ts
export interface Payment {
  id: string;
  studentId: string;
  studentName?: string;
  amount: number;
  method: "CASH" | "CARD" | "TRANSFER" | "OTHER";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paidAt: string;
  reference?: string;
  comment?: string;
  recordedById: string;
  recordedByName?: string;
  createdAt: string;
  summary?: StudentFinanceSummary;
}
export interface Expense {
  id: string;
  title: string;
  category:
    | "SALARY"
    | "RENT"
    | "UTILITIES"
    | "EQUIPMENT"
    | "MARKETING"
    | "OTHER";
  amount: number;
  method: "CASH" | "CARD" | "TRANSFER" | "OTHER";
  paidAt: string;
  note?: string;
  recordedById: string;
  recordedByName?: string;
  createdAt: string;
}

export interface FinanceOverview {
  from: Date;
  to: Date;
  method?: string;
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

export interface FinanceSummary {
  studentId: string;
  totalCharges: number;
  totalPaid: number;
  debt: number;
  lastPayments: Array<{
    id: string;
    amount: string;
    method: string;
    status: string;
    paidAt: string;
    comment?: string;
    createdAt: string;
  }>;
}
export interface FinanceStats {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  paymentCount: number;
  expenseCount: number;
}

export interface ApiResponse<T> {
  data?: T;
  items?: T[];
  meta?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
  message?: string;
  error?: string;
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
