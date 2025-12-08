import { create } from "zustand";
import { financeService } from "../../Service/FinanceService";

interface Expense {
  title: string;
  category: string;
  amount: number;
  method: "CASH" | "CARD" | "TRANSFER" | "OTHER";
  note?: string;
  paidAt?: string;
}

interface ExpenseStore {
  isSubmitting: boolean;
  alertOpen: boolean;
  alertContent: {
    title: string;
    description: string;
    type: "success" | "error";
  };
  submitExpense: (expenseData: Expense) => Promise<void>;
  resetForm: () => void;
  setAlert: (alert: {
    title: string;
    description: string;
    type: "success" | "error";
  }) => void;
  setAlertOpen: (open: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  isSubmitting: false,
  alertOpen: false,
  alertContent: {
    title: "",
    description: "",
    type: "success",
  },

  submitExpense: async (expenseData: Expense) => {
    set({ isSubmitting: true });
    try {
      const result = await financeService.createExpense({
        ...expenseData,
        paidAt: expenseData.paidAt || new Date().toISOString(),
      });

      console.log("Chiqim muvaffaqiyatli:", result);

      get().setAlert({
        title: "Muvaffaqiyatli",
        description: "Chiqim muvaffaqiyatli qoʻshildi",
        type: "success",
      });

      return result;
    } catch (error: any) {
      console.error("Chiqim qoʻshishda xatolik:", error);
      get().setAlert({
        title: "Xatolik",
        description: error.message || "Chiqim qoʻshishda xatolik yuz berdi",
        type: "error",
      });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  resetForm: () => {
    // Formani tozalash uchun
    set({
      alertOpen: false,
      isSubmitting: false,
    });
  },

  setAlert: (alert) => set({ alertContent: alert }),
  setAlertOpen: (open) => set({ alertOpen: open }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
}));
