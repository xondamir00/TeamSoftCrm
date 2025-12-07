// To'lov va chiqim typelari
export interface Payment {
  id: string;
  studentId: string;
  studentName?: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paidAt: string;
  reference?: string;
  comment?: string;
  recordedById: string;
  recordedByName?: string;
  createdAt: string;
}
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';

export interface StudentFinanceSummary {
  studentId: string;
  studentName: string;
  groupId?: string;
  groupName?: string;
  summary: Payment;
  recentPayments: Payment[];
  paymentHistory: {
    month: string;
    totalPaid: number;
    totalDue: number;
  }[];
}
export interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';
  paidAt: string;
  note?: string;
  recordedById: string;
  recordedByName?: string;
  createdAt: string;
}

export interface FinanceOverview {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  method?: string;
  from?: string;
  to?: string;
}

export interface FinanceStats {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  paymentCount: number;
  expenseCount: number;
}

export interface Student {
  id: string;
  fullName: string;
  phone: string;
  isActive?: boolean;
  dateOfBirth?: string;
  startDate?: string;
}