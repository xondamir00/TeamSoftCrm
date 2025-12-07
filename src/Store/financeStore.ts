// Agar useFinanceStore ishlatmoqchi bo'lsangiz, quyidagicha yangilang:
import { create } from 'zustand';
import { financeService } from '../Store/FinanceService';
import type { Payment, Expense, FinanceOverview } from '../Store/index';

interface FinanceStore {
  payments: Payment[];
  expenses: Expense[];
  overview: FinanceOverview | null;
  paymentLoading: boolean;
  expenseLoading: boolean;
  overviewLoading: boolean;
  
  fetchPayments: (params?: any) => Promise<void>;
  fetchExpenses: (params?: any) => Promise<void>;
  fetchOverview: (params?: any) => Promise<void>;
  createPayment: (data: any) => Promise<void>;
  createExpense: (data: any) => Promise<void>;
}

const useFinanceStore = create<FinanceStore>((set) => ({
  payments: [],
  expenses: [],
  overview: null,
  paymentLoading: false,
  expenseLoading: false,
  overviewLoading: false,

  fetchPayments: async (params) => {
    set({ paymentLoading: true });
    try {
      const res = await financeService.getPayments(params);
      set({ payments: res.items || [] });
    } catch (error) {
      console.error('To\'lovlar yuklashda xatolik:', error);
    } finally {
      set({ paymentLoading: false });
    }
  },

  fetchExpenses: async (params) => {
    set({ expenseLoading: true });
    try {
      const res = await financeService.getExpenses(params);
      set({ expenses: res.items || [] });
    } catch (error) {
      console.error('Chiqimlar yuklashda xatolik:', error);
    } finally {
      set({ expenseLoading: false });
    }
  },

  fetchOverview: async (params) => {
    set({ overviewLoading: true });
    try {
      const overview = await financeService.getOverview(params);
      set({ overview });
    } catch (error) {
      console.error('Overview yuklashda xatolik:', error);
    } finally {
      set({ overviewLoading: false });
    }
  },

  createPayment: async (data) => {
    try {
      await financeService.createPayment(data);
      // Automatically refresh payments
      const res = await financeService.getPayments();
      set({ payments: res.items || [] });
    } catch (error) {
      console.error('To\'lov yaratishda xatolik:', error);
      throw error;
    }
  },

  createExpense: async (data) => {
    try {
      await financeService.createExpense(data);
      // Automatically refresh expenses
      const res = await financeService.getExpenses();
      set({ expenses: res.items || [] });
    } catch (error) {
      console.error('Chiqim yaratishda xatolik:', error);
      throw error;
    }
  },
}));

export default useFinanceStore;