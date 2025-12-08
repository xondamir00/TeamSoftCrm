import { create } from "zustand";
import { api } from "@/Service/ApiService/api";
import { financeService } from "@/Service/FinanceService/FinanceService";
import type { PaymentData, Student } from "../Finanace/FinanceInterface";




interface PaymentStore {
  // State
  students: Student[];
  filteredStudents: Student[];
  selectedStudent: Student | null;
  searchQuery: string;
  isLoadingStudents: boolean;
  isSubmitting: boolean;
  alertOpen: boolean;
  alertContent: {
    title: string;
    description: string;
    type: "success" | "error";
  };
  isDropdownOpen: boolean;

  // Actions
  fetchStudents: () => Promise<void>;
  filterStudents: (query: string) => void;
  selectStudent: (studentId: string) => void;
  clearSelectedStudent: () => void;
  submitPayment: (paymentData: PaymentData) => Promise<void>;
  setDropdownOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setAlert: (alert: {
    title: string;
    description: string;
    type: "success" | "error";
  }) => void;
  setAlertOpen: (open: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  resetForm: () => void;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  // Initial state
  students: [],
  filteredStudents: [],
  selectedStudent: null,
  searchQuery: "",
  isLoadingStudents: false,
  isSubmitting: false,
  alertOpen: false,
  alertContent: {
    title: "",
    description: "",
    type: "success",
  },
  isDropdownOpen: false,

  // Actions
  fetchStudents: async () => {
    set({ isLoadingStudents: true });
    try {
      const res = await api.get("/students", {
        params: {
          limit: 1000,
          isActive: true,
        },
      });

      const items = res.data?.items || res.data || [];
      set({
        students: items,
        filteredStudents: items,
      });
    } catch (error) {
      console.error("Talabalar yuklashda xatolik:", error);
      get().setAlert({
        title: "Xatolik",
        description: "Talabalar ro'yxatini yuklashda xatolik yuz berdi",
        type: "error",
      });
    } finally {
      set({ isLoadingStudents: false });
    }
  },

  filterStudents: (query) => {
    const { students } = get();
    if (query.trim() === "") {
      set({ filteredStudents: students, searchQuery: query });
    } else {
      const filtered = students.filter(
        (student) =>
          student.fullName.toLowerCase().includes(query.toLowerCase()) ||
          student.phone.includes(query)
      );
      set({ filteredStudents: filtered, searchQuery: query });
    }
  },

  selectStudent: (studentId) => {
    const { students } = get();
    const student = students.find((s) => s.id === studentId);
    set({
      selectedStudent: student || null,
      isDropdownOpen: false,
      searchQuery: "",
    });
  },

  clearSelectedStudent: () => {
    set({
      selectedStudent: null,
      searchQuery: "",
    });
  },

  submitPayment: async (paymentData: PaymentData) => {
    set({ isSubmitting: true });
    try {
      const result = await financeService.createPayment({
        ...paymentData,
        paidAt: paymentData.paidAt || new Date().toISOString(),
      });

      console.log("To'lov muvaffaqiyatli:", result);

      get().setAlert({
        title: "Muvaffaqiyatli",
        description: "Toʻlov muvaffaqiyatli qoʻshildi",
        type: "success",
      });

      return result;
    } catch (error: any) {
      console.error("Toʻlov qoʻshishda xatolik:", error);
      get().setAlert({
        title: "Xatolik",
        description: error.message || "Toʻlov qoʻshishda xatolik yuz berdi",
        type: "error",
      });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  setDropdownOpen: (open) => set({ isDropdownOpen: open }),
  setSearchQuery: (query) => get().filterStudents(query),

  setAlert: (alert) => set({ alertContent: alert }),
  setAlertOpen: (open) => set({ alertOpen: open }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

  resetForm: () => {
    set({
      selectedStudent: null,
      searchQuery: "",
      alertOpen: false,
      isSubmitting: false,
    });
  },
}));
