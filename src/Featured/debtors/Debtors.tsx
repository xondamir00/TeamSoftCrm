"use client";

import { useState, useEffect } from "react";
import { DebtorStats } from "@/Featured/Debtors/DebtorsStats";
import { DebtorFilters } from "@/Featured/Debtors/DebtorFilters";
import { DebtorList } from "@/Featured/Debtors/DebtorList";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { debtorService } from "@/Service/DebtorsService/DebtorService";
import type { Debtor } from "@/Store/Finanace/FinanceInterface";

const Debtors = () => {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [filteredDebtors, setFilteredDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minDebt, setMinDebt] = useState("0");

  const loadDebtors = async () => {
    try {
      setLoading(true);
      const minDebtNumber = parseInt(minDebt) || 0;
      const data = await debtorService.getDebtors(minDebtNumber);
      setDebtors(data);
      setFilteredDebtors(data);
    } catch (error) {
      console.error("Error loading debtors:", error);
      toast.error("Qarzdorlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebtors();
  }, [minDebt]);

  // Qidiruv filteri
  useEffect(() => {
    if (!search.trim()) {
      setFilteredDebtors(debtors);
      return;
    }

    const filtered = debtors.filter(
      (debtor) =>
        debtor.fullName.toLowerCase().includes(search.toLowerCase()) ||
        debtor.phone.includes(search) ||
        debtor.groups.some((group) =>
          group.name.toLowerCase().includes(search.toLowerCase())
        )
    );
    setFilteredDebtors(filtered);
  }, [search, debtors]);

  const handleSendReminder = async (studentId: string) => {
    try {
      await debtorService.sendReminder(studentId);
      toast.success("Eslatma yuborildi!");
    } catch (error) {
      toast.error("Eslatma yuborishda xatolik");
    }
  };

  if (loading && debtors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Qarzdorlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalDebtors: filteredDebtors.length,
    totalAmount: filteredDebtors.reduce((sum, d) => sum + d.totalDebt, 0),
    averageDebt: filteredDebtors.length
      ? Math.round(
          filteredDebtors.reduce((sum, d) => sum + d.totalDebt, 0) /
            filteredDebtors.length
        )
      : 0,
    highestDebt: filteredDebtors.length
      ? Math.max(...filteredDebtors.map((d) => d.totalDebt))
      : 0,

    totalGroups: filteredDebtors.reduce((sum, d) => sum + d.groups.length, 0),
    debtByMonth: [],
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Qarzdorlar Ro'yxati
          </h1>
        </div>

        <DebtorStats stats={stats} />

        <DebtorFilters
          search={search}
          setSearch={setSearch}
          minDebt={minDebt}
          setMinDebt={setMinDebt}
          debtors={debtors}
        />
        <DebtorList
          debtors={filteredDebtors}
          onSendReminder={handleSendReminder}
          onRefresh={loadDebtors}
        />

        {filteredDebtors.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Qarzdorlar topilmadi
            </h3>
            <p className="text-gray-500">
              {search
                ? "Qidiruv bo'yicha qarzdor topilmadi"
                : "Hozircha qarzdorlar mavjud emas"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Debtors;
