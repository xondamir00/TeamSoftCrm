import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  ChevronDown, 
  ChevronUp,
  DollarSign,
  AlertCircle
} from "lucide-react";
import type { DebtorItemProps } from "@/Store/Finanace/FinanceInterface";


export function DebtorItem({ debtor, index }: DebtorItemProps) {
  const [expanded, setExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };



  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{debtor.fullName}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-3 h-3" />
                <span>{debtor.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge 
              variant="destructive" 
              className="text-lg px-3 py-1"
            >
              <DollarSign className="w-4 h-4 mr-1" />
              {formatCurrency(debtor.totalDebt)}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-2">
              {debtor.groups.map((group) => (
                <div
                  key={group.groupId}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="font-medium">{group.name}</span>
                  <Badge variant="secondary">
                    {formatCurrency(group.debt)}
                  </Badge>
                </div>
              ))}
            </div>
            {debtor.totalDebt > 1000000 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-300">
                    Yuqori qarz darajasi
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Qarz miqdori 1 milliondan oshgan
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}