import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, History } from "lucide-react";

interface PaymentHistoryProps {
  payments: Array<{
    id: string;
    amount: string;
    method: string;
    status: string;
    paidAt: string;
    comment?: string;
  }>;
  loading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  getPaymentMethodIcon: (method: string) => string;
}

export function PaymentHistory({ 
  payments, 
  loading, 
  formatCurrency, 
  formatDate, 
  getPaymentMethodIcon 
}: PaymentHistoryProps) {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          To'lovlar tarixi
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-xl">{getPaymentMethodIcon(payment.method)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{formatCurrency(Number(payment.amount))}</p>
                    <p className="text-sm text-slate-500">
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'}
                    className={
                      payment.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {payment.status === 'COMPLETED' ? 'To\'langan' : 'Kutilmoqda'}
                  </Badge>
                  <p className="text-sm text-slate-500 mt-1">{payment.method}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
              To'lovlar mavjud emas
            </h3>
            <p className="text-slate-500 mt-2">
              Talabaning to'lov tarixi bo'sh
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}