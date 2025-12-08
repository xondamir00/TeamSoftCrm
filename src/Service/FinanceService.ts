// src/finance/services/finance.service.ts
import { api } from "@/Service/api";
import type {
  Payment,
  Expense,
  FinanceOverview,
  StudentFinanceSummary,
  ApiResponse,
} from "../Store/finance";

class FinanceService {
  // To'lov yaratish - backend: POST /finance/payments
  async createPayment(paymentData: {
    studentId: string;
    amount: number;
    method: "CASH" | "CARD" | "TRANSFER" | "OTHER";
    reference?: string;
    comment?: string;
    paidAt?: string;
    groupId?: string;
  }) {
    try {
      const response = await api.post<{
        payment: Payment;
        summary: StudentFinanceSummary;
      }>("/finance/payments", paymentData);
      return response.data;
    } catch (error: any) {
      console.error("To'lov yaratishda xatolik:", error);
      throw new Error(
        error.response?.data?.message || "To'lov yaratishda xatolik"
      );
    }
  }

  // Chiqim yaratish - backend: POST /finance/expenses
  async createExpense(expenseData: {
    title: string;
    category: string;
    amount: number;
    method: "CASH" | "CARD" | "TRANSFER" | "OTHER";
    note?: string;
    paidAt?: string;
  }) {
    try {
      // Noto'g'ri: /finance/overview, To'g'ri: /finance/expenses
      const response = await api.post<Expense>(
        "/finance/expenses",
        expenseData
      );
      return response.data;
    } catch (error: any) {
      console.error("Chiqim yaratishda xatolik:", error);
      throw new Error(
        error.response?.data?.message || "Chiqim yaratishda xatolik"
      );
    }
  }

  // To'lovlar ro'yxati - yangi endpoint kerak
  async getPayments(params?: {
    limit?: number;
    page?: number;
    search?: string;
    method?: string;
    status?: string;
    studentId?: string;
    from?: string;
    to?: string;
  }) {
    try {
      const response = await api.get<ApiResponse<Payment>>(
        "/finance/payments/list",
        {
          params: {
            ...params,
            limit: params?.limit || 20,
            page: params?.page || 1,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("To'lovlar olishda xatolik:", error);

      // Agar endpoint mavjud bo'lmasa, fallback qil
      if (error.response?.status === 404) {
        return { items: [], total: 0, page: 1, limit: 20, totalPages: 0 };
      }

      throw new Error(
        error.response?.data?.message || "To'lovlar olishda xatolik"
      );
    }
  }

  // Chiqimlar ro'yxati - yangi endpoint kerak
  async getExpenses(params?: {
    limit?: number;
    page?: number;
    search?: string;
    category?: string;
    method?: string;
    from?: string;
    to?: string;
  }) {
    try {
      const response = await api.get<ApiResponse<Expense>>(
        "/finance/expenses/list",
        {
          params: {
            ...params,
            limit: params?.limit || 20,
            page: params?.page || 1,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Chiqimlar olishda xatolik:", error);

      // Agar endpoint mavjud bo'lmasa, fallback qil
      if (error.response?.status === 404) {
        return { items: [], total: 0, page: 1, limit: 20, totalPages: 0 };
      }

      throw new Error(
        error.response?.data?.message || "Chiqimlar olishda xatolik"
      );
    }
  }

  // Finance overview - backend: GET /finance/overview
  async getOverview(params?: { from?: string; to?: string; method?: string }) {
    try {
      const response = await api.get<FinanceOverview>("/finance/overview", {
        params: {
          ...params,
          from:
            params?.from ||
            new Date(new Date().getFullYear(), 0, 1)
              .toISOString()
              .split("T")[0],
          to: params?.to || new Date().toISOString().split("T")[0],
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Overview olishda xatolik:", error);

      // Agar endpoint mavjud bo'lmasa, fallback qil
      if (error.response?.status === 404) {
        console.log("Overview endpoint mavjud emas, fallback ishlatiladi...");
        return {
          from: new Date(),
          to: new Date(),
          totalIncome: 0,
          totalExpense: 0,
          profit: 0,
          payments: [],
          expenses: [],
          summaryByMethod: [],
        };
      }

      throw new Error(
        error.response?.data?.message || "Overview olishda xatolik"
      );
    }
  }

  // Student summary - backend: GET /finance/students/:id/summary
  async getStudentSummary(studentId: string) {
    try {
      const response = await api.get<StudentFinanceSummary>(
        `/finance/students/${studentId}/summary`
      );
      return response.data;
    } catch (error: any) {
      console.error("Student summary olishda xatolik:", error);
      throw new Error(
        error.response?.data?.message || "Student summary olishda xatolik"
      );
    }
  }

  // Export to Excel - yangi endpoint kerak
  async exportToExcel(params?: {
    from?: string;
    to?: string;
    method?: string;
    type?: "payments" | "expenses" | "all";
  }) {
    try {
      const response = await api.get("/finance/export", {
        params,
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      console.error("Export qilishda xatolik:", error);
      throw new Error(
        error.response?.data?.message || "Export qilishda xatolik"
      );
    }
  }
}

export const financeService = new FinanceService();
