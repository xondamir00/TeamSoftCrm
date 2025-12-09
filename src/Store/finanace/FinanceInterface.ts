import type { ReactNode } from "react";
import z from "zod";

// To'lov va chiqim typelari
export interface Payment {
  id: string;
  studentId: string;
  studentName?: string;
  amount: number;
  method: "CASH" | "CARD" | "TRANSFER" | "OTHER";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt: string;
  reference?: string;
  comment?: string;
  recordedById: string;
  recordedByName?: string;
  createdAt: string;
  summary?: StudentFinanceSummary;
}

export interface PaymentMethodDistribution {
  method: string;
  amount: number;
  percentage: number;
}
export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  studentId: string;
  studentName: string;
  loading: boolean;
}
export interface ChartData {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
  profitData: number[];
}
export interface Debtor {
  studentId: string;
  fullName: string;
  phone: string;
  totalDebt: number;
  lastPaymentDate?: string;
  email?: string;
  avatar?: string;
  status?: "active" | "inactive";
  groups: { groupId: string; name: string; debt: number }[];
}
export interface DebtorStats {
  totalDebtors: number;
  totalAmount: number;
  averageDebt: number;
  highestDebt: number;
  totalGroups: number;
  debtByMonth: {
    month: string;
    amount: number;
  }[];
}
export interface DebtorFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  minDebt: string;
  setMinDebt: (value: string) => void;
  debtors: Debtor[];
}
export interface DebtorItemProps {
  debtor: Debtor;
  index: number;
}
export interface DebtorListProps {
  debtors: Debtor[];
  onSendReminder: (studentId: string) => void;
  onRefresh: () => void;
}
export interface DebtorStatsProps {
  stats: DebtorStats;
}

export interface DebtorPaymentHistory {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: "completed" | "pending";
  comment?: string;
}
export interface FinanceStats {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  paymentCount: number;
  expenseCount: number;
}
export interface FinanceStatsProps {
  stats: FinanceStats;
  loading?: boolean;
}

export interface PaymentAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertContent: {
    title: string;
    description: string;
    type: "success" | "error";
  };
}
export interface PaymentData {
  studentId: string;
  amount: number;
  method: "CASH" | "CARD" | "TRANSFER" | "OTHER";
  reference?: string;
  comment?: string;
  paidAt?: string;
}
export type PaymentMethod = "CASH" | "CARD" | "TRANSFER" | "OTHER";

export interface StudentFinanceSummary {
  studentId: string;
  studentName: string;
  groupId?: string;
  groupName?: string;
  summary: Payment;
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
  recentPayments: Payment[];
  paymentHistory: {
    month: string;
    totalPaid: number;
    totalDue: number;
  }[];
}
export const expenseSchema = z.object({
  title: z.string().min(1, "Sarlavha kiritish shart"),
  category: z.string().min(1, "Kategoriya tanlash shart"),
  amount: z.coerce.number().positive("Summa musbat boʻlishi kerak"),
  method: z.enum(["CASH", "CARD", "TRANSFER", "OTHER"]),
  note: z.string().optional(),
  paidAt: z.date().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

export interface CreateExpenseFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<ExpenseFormData>;
}

export interface ApiResponse<T> {
  items: T[];
  data?: T;

  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  message?: string;
  meta?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
  error?: string;
}
export interface ExpenseAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertContent: {
    title: string;
    description: string;
    type: "success" | "error";
  };
}
export interface ExpenseHeaderProps {
  title?: string;
  description?: string;
}
export interface ExpenseFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
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

export interface ExpenseStore {
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
export interface GlobalBalance {
  totalCharges: number;
  totalIncome: number;
  totalExpense: number;
  netCash: number;
  totalDebt: number;
}

export interface FinanceOverview {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  method?: string;
  from?: string;
  to?: string;
}

export interface Student {
  id: string;
  fullName: string;
  phone: string;
  isActive?: boolean;
  dateOfBirth?: string;
  startDate?: string;
}
