// FinanceStore.ts - O'ZGARTIRILGAN VERSIYA
import { create } from "zustand";
import { financeService } from "@/Service/FinanceService/FinanceService";
import type { Expense, ExpenseStore } from "./FinanceInterface";

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  isSubmitting: false,
  alertOpen: false,
  alertContent: {
    title: "",
    description: "",
    type: "success",
  },

  // Arrow function o'rniga regular function ishlating
  submitExpense: async function (expenseData: Expense) {
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
    set({
      alertOpen: false,
      isSubmitting: false,
    });
  },

  setAlert: (alert) => set({ alertContent: alert }),
  setAlertOpen: (open) => set({ alertOpen: open }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
}));
