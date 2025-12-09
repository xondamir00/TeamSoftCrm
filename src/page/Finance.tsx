import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingDown } from "lucide-react";
import { api } from "@/Service/ApiService/api";
import CreatePaymentForm from "../Featured/finance/form/payment/CreatePaymentForm";
import CreateExpenseForm from "../Featured/finance/form/expence/CreateExpenseForm";
import FinanceStatss from "../Featured/finance/FinanceStats";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { FinanceStats } from "@/Store/Finanace/FinanceInterface";

export default function FinancePage() {
  const [stats, setStats] = useState<FinanceStats>({
    totalIncome: 0,
    totalExpense: 0,
    profit: 0,
    paymentCount: 0,
    expenseCount: 0,
  });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const fetchOverviewData = async () => {
    try {
      const res = await api.get("/finance/overview");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      {/* Header Section */}
      <div className="p-6 rounded-2xl dark:bg-gradient-to-br from-blue-600/10  dark:from-slate-800/40  border shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold dark:bg-gradient-to-r  dark:from-blue-300 dark:to-blue-500 dark:bg-clip-text dark:text-transparent">
              Moliya Boshqaruvi
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Toʻlovlar, chiqimlar va moliyaviy hisobotlar
            </p>
          </div>

          <div className="flex gap-2">
            {/* Payment Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="glass-card px-5 py-2.5 shadow hover:scale-105 transition">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Toʻlov qoʻshish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-8 max-h-[90vh] overflow-y-auto">
                <CreatePaymentForm />
              </DialogContent>
            </Dialog>

            {/* Expense Modal */}
            <Dialog
              open={isExpenseModalOpen}
              onOpenChange={setIsExpenseModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="glass-card bg-gradient-to-r from-red-600 to-red-700 text-white shadow hover:scale-105 transition">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Chiqim qoʻshish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-8 max-h-[90vh] overflow-y-auto">
                <CreateExpenseForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <FinanceStatss stats={stats} />
    </div>
  );
}
