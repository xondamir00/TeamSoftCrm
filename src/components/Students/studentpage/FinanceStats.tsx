import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, DollarSign, AlertCircle } from "lucide-react";

interface FinanceStatsProps {
  finance: {
    totalCharges: number;
    totalPaid: number;
    debt: number;
  } | null;
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

export function FinanceStats({ finance, loading, formatCurrency }: FinanceStatsProps) {
  const paymentProgress = finance 
    ? Math.min(100, (finance.totalPaid / finance.totalCharges) * 100)
    : 0;

  return (
    <Card className="border-slate-200 p-4 dark:border-slate-700 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Moliyaviy holat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : finance ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  To'langan: {formatCurrency(finance.totalPaid)}
                </span>
                <span className="font-medium">
                  {paymentProgress.toFixed(1)}%
                </span>
              </div>
              <Progress value={paymentProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">To'langan</p>
                <p className="text-xl font-bold">{formatCurrency(finance.totalPaid)}</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">Qarz</p>
                <p className="text-xl font-bold">{formatCurrency(finance.debt)}</p>
              </div>
            </div>

            {finance.debt > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-700 dark:text-amber-400">
                    Talabada {formatCurrency(finance.debt)} miqdorida qarz mavjud
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-slate-500 py-8">
            Moliyaviy ma'lumotlar mavjud emas
          </p>
        )}
      </CardContent>
    </Card>
  );
}