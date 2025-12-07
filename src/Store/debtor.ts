export interface DebtorGroup {
  groupId: string;
  name: string;
  debt: number;
}

export interface Debtor {
  studentId: string;
  fullName: string;
  phone: string;
  totalDebt: number;
  groups: DebtorGroup[];
  lastPaymentDate?: string;
  email?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
}

export interface DebtorPaymentHistory {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending';
  comment?: string;
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