import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, TrendingDown } from "lucide-react";

interface FinanceCardsProps {
  finance: {
    totalCharges: number;
    totalPaid: number;
    debt: number;
  };
  formatCurrency: (amount: number) => string;
}

export function FinanceCards({ finance, formatCurrency }: FinanceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Jami hisob</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(finance.totalCharges)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Jami to'langan</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {formatCurrency(finance.totalPaid)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Qoldiq qarz</p>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {formatCurrency(finance.debt)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}