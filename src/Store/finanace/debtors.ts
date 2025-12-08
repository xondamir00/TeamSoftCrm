import { api } from "@/Service/api";

export interface GlobalBalance {
  totalCharges: number;
  totalIncome: number;
  totalExpense: number;
  netCash: number;
  totalDebt: number;
}

export interface FinanceOverview {
  from: string;
  to: string;
  method: string;
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

export interface Debtor {
  studentId: string;
  fullName: string;
  phone: string;
  totalDebt: number;
  groups: { groupId: string; name: string; debt: number }[];
}

export interface ChartData {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
  profitData: number[];
}

export interface PaymentMethodDistribution {
  method: string;
  amount: number;
  percentage: number;
}

export const financeApi = {
  // Global balans olish
  getGlobalBalance: async (): Promise<GlobalBalance> => {
    const { data } = await api.get("/finance/balance");
    return data;
  },

  // Moliyaviy ko'rish
  getFinanceOverview: async (
    from?: string,
    to?: string,
    method?: string
  ): Promise<FinanceOverview> => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (method) params.append("method", method);

    const { data } = await api.get(`/finance/overview?${params.toString()}`);
    return data;
  },

  // Qarzdorlar ro'yxati
  getDebtors: async (minDebt: number = 0): Promise<Debtor[]> => {
    const params = new URLSearchParams();
    if (minDebt > 0) params.append("minDebt", minDebt.toString());

    const { data } = await api.get(`/finance/debtors?${params.toString()}`);
    return data;
  },

  // Talaba summasi
  getStudentSummary: async (studentId: string) => {
    const { data } = await api.get(`/finance/students/${studentId}/summary`);
    return data;
  },

  // Chart uchun ma'lumotlar (backenddan)
  getChartData: async (
    range: "yearly" | "monthly" | "weekly",
    period: string
  ): Promise<ChartData> => {
    const params = new URLSearchParams();
    params.append("range", range);
    params.append("period", period);

    const { data } = await api.get(`/finance/charts?${params.toString()}`);
    return data;
  },

  // To'lov usullari bo'yicha taqsimot
  getPaymentMethodDistribution: async (): Promise<
    PaymentMethodDistribution[]
  > => {
    const { data } = await api.get("/finance/payment-methods/distribution");
    return data;
  },

  // Oy davomidagi ma'lumotlar
  getMonthlyData: async (year: number, month: number) => {
    const { data } = await api.get(`/finance/monthly/${year}/${month}`);
    return data;
  },

  // Yillik ma'lumotlar
  getYearlyData: async (year: number) => {
    const { data } = await api.get(`/finance/yearly/${year}`);
    return data;
  },
};
