import type { Debtor } from "@/Store/debtor";
import { api } from "./api";

export const debtorService = {
  /**
   * Qarzdorlarni olish
   */
  getDebtors: async (minDebt?: number): Promise<Debtor[]> => {
    const params = minDebt ? { minDebt } : {};
    const response = await api.get("/finance/debtors", { params });
    return response.data;
  },

  /**
   * Bitta qarzdorni olish
   */
  getDebtorById: async (studentId: string): Promise<Debtor> => {
    const response = await api.get(`/finance/debtors/${studentId}`);
    return response.data;
  },

  /**
   * Qarzdor statistikasini olish
   */
  getDebtorStats: async (): Promise<{
    totalDebtors: number;
    totalAmount: number;
    averageDebt: number;
    highestDebt: number;
  }> => {
    const debtors = await debtorService.getDebtors();

    const totalAmount = debtors.reduce(
      (sum, debtor) => sum + debtor.totalDebt,
      0
    );
    const highestDebt = Math.max(...debtors.map((d) => d.totalDebt));

    return {
      totalDebtors: debtors.length,
      totalAmount,
      averageDebt: debtors.length
        ? Math.round(totalAmount / debtors.length)
        : 0,
      highestDebt,
    };
  },

  /**
   * Qarzdorga eslatma yuborish
   */
  sendReminder: async (
    studentId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/finance/debtors/${studentId}/remind`);
    return response.data;
  },

  /**
   * Barcha qarzdorlarga eslatma yuborish
   */
  sendReminderToAll: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await api.post("/finance/debtors/remind-all");
    return response.data;
  },

  /**
   * Qarzdorlar hisobotini yuklab olish
   */
  exportDebtors: async (format: "excel" | "pdf" = "excel"): Promise<Blob> => {
    const response = await api.get("/finance/debtors/export", {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Qarzdor qidirish
   */
  searchDebtors: async (query: string): Promise<Debtor[]> => {
    const response = await api.get("/finance/debtors/search", {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * Qarzdorni to'lov qilgan deb belgilash
   */
  markAsPaid: async (studentId: string): Promise<{ success: boolean }> => {
    const response = await api.put(`/finance/debtors/${studentId}/mark-paid`);
    return response.data;
  },

  /**
   * Qarzdorlik tarixi
   */
  getDebtHistory: async (studentId: string): Promise<any[]> => {
    const response = await api.get(`/finance/debtors/${studentId}/history`);
    return response.data;
  },
};
