// store/financeStore.ts
import { create } from 'zustand';
import { api } from '@/Service/api';

export interface Payment {
  id: string;
  studentId: string;
  studentName?: string;
  groupId?: string | null;
  groupName?: string;
  amount: number;
  method: PaymentMethod;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paidAt: string;
  reference?: string | null;
  comment?: string | null;
  recordedById: string;
  recordedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  note?: string | null;
  recordedById: string;
  recordedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFinanceSummary {
  studentId: string;
  studentName?: string;
  totalCharges: number;
  totalPaid: number;
  debt: number;
  lastPayments: Payment[];
}

export interface FinanceOverview {
  from: string;
  to: string;
  method?: PaymentMethod | 'ALL';
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';
export type ExpenseCategory = 'SALARY' | 'RENT' | 'UTILITIES' | 'SUPPLIES' | 'OTHER';

interface CreatePaymentDto {
  studentId: string;
  groupId?: string | null;
  amount: number;
  method: PaymentMethod;
  reference?: string | null;
  comment?: string | null;
  paidAt?: string;
}

interface CreateExpenseDto {
  title: string;
  category: ExpenseCategory;
  amount: number;
  method: PaymentMethod;
  note?: string | null;
  paidAt?: string;
}

interface FinanceState {
  // Payments
  payments: Payment[];
  paymentsLoading: boolean;
  paymentsError: string | null;
  
  // Expenses
  expenses: Expense[];
  expensesLoading: boolean;
  expensesError: string | null;
  
  // Overview
  overview: FinanceOverview | null;
  overviewLoading: boolean;
  overviewError: string | null;
  
  // Selected student summary
  selectedStudentSummary: StudentFinanceSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  
  // Actions
  setPayments: (payments: Payment[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  setOverview: (overview: FinanceOverview) => void;
  setSelectedStudentSummary: (summary: StudentFinanceSummary) => void;
  
  // API Actions
  fetchPayments: (params?: {
    studentId?: string;
    groupId?: string;
    from?: string;
    to?: string;
    method?: PaymentMethod;
  }) => Promise<void>;
  
  fetchExpenses: (params?: {
    category?: ExpenseCategory;
    from?: string;
    to?: string;
    method?: PaymentMethod;
  }) => Promise<void>;
  
  fetchOverview: (params?: {
    from?: string;
    to?: string;
    method?: PaymentMethod;
  }) => Promise<void>;
  
  fetchStudentSummary: (studentId: string) => Promise<void>;
  
  createPayment: (dto: CreatePaymentDto) => Promise<{
    payment: Payment;
    summary: StudentFinanceSummary;
  }>;
  
  createExpense: (dto: CreateExpenseDto) => Promise<Expense>;
}

const useFinanceStore = create<FinanceState>((set, get) => ({
  // Initial state
  payments: [],
  paymentsLoading: false,
  paymentsError: null,
  
  expenses: [],
  expensesLoading: false,
  expensesError: null,
  
  overview: null,
  overviewLoading: false,
  overviewError: null,
  
  selectedStudentSummary: null,
  summaryLoading: false,
  summaryError: null,
  
  // Setters
  setPayments: (payments) => set({ payments }),
  setExpenses: (expenses) => set({ expenses }),
  setOverview: (overview) => set({ overview }),
  setSelectedStudentSummary: (summary) => set({ selectedStudentSummary: summary }),
  
  // API Actions
  fetchPayments: async (params = {}) => {
    set({ paymentsLoading: true, paymentsError: null });
    
    try {
      const { data } = await api.get('/payments', { params });
      set({ payments: data, paymentsLoading: false });
    } catch (error: unknown) {
      set({ 
        paymentsError: 'Toʻlovlarni yuklashda xatolik', 
        paymentsLoading: false 
      });
      console.error('Fetch payments error:', error);
    }
  },
  
  fetchExpenses: async (params = {}) => {
    set({ expensesLoading: true, expensesError: null });
    
    try {
      const { data } = await api.get('/expenses', { params });
      set({ expenses: data, expensesLoading: false });
    } catch (error: unknown) {
      set({ 
        expensesError: 'Chiqimlarni yuklashda xatolik', 
        expensesLoading: false 
      });
      console.error('Fetch expenses error:', error);
    }
  },
  
  fetchOverview: async (params = {}) => {
    set({ overviewLoading: true, overviewError: null });
    
    try {
      const { data } = await api.get('/finance/overview', { params });
      set({ overview: data, overviewLoading: false });
    } catch (error: unknown) {
      set({ 
        overviewError: 'Moliyaviy holatni yuklashda xatolik', 
        overviewLoading: false 
      });
      console.error('Fetch overview error:', error);
    }
  },
  
  fetchStudentSummary: async (studentId: string) => {
    set({ summaryLoading: true, summaryError: null });
    
    try {
      const { data } = await api.get(`/finance/students/${studentId}/summary`);
      set({ selectedStudentSummary: data, summaryLoading: false });
    } catch (error: unknown) {
      set({ 
        summaryError: 'Talaba hisobini yuklashda xatolik', 
        summaryLoading: false 
      });
      console.error('Fetch student summary error:', error);
    }
  },
  
  createPayment: async (dto: CreatePaymentDto) => {
    try {
      const { data } = await api.post('/finance/payments', dto);
      
      // Yangi to'lovni ro'yxatga qo'shish
      const currentPayments = get().payments;
      set({ payments: [data.payment, ...currentPayments] });
      
      return data;
    } catch (error: unknown) {
      console.error('Create payment error:', error);
      throw error;
    }
  },
  
  createExpense: async (dto: CreateExpenseDto) => {
    try {
      const { data } = await api.post('/finance/expenses', dto);
      
      // Yangi chiqimni ro'yxatga qo'shish
      const currentExpenses = get().expenses;
      set({ expenses: [data, ...currentExpenses] });
      
      return data;
    } catch (error: unknown) {
      console.error('Create expense error:', error);
      throw error;
    }
  },
}));

export default useFinanceStore;