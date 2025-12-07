import { Card, CardContent } from "@/components/ui/card";
import type { DebtorStats } from "@/Store/debtor";
import { DollarSign, Users, TrendingUp, AlertTriangle } from "lucide-react";

interface DebtorStatsProps {
  stats: DebtorStats;
}

export function DebtorStats({ stats }: DebtorStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Jami qarzdorlar</p>
              <p className="text-2xl font-bold">{stats.totalDebtors}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">Jami qarz</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 dark:text-amber-400">O'rtacha qarz</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.averageDebt)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">Eng katta qarz</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.highestDebt)}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}