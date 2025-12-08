import type { ExpenseHeaderProps } from '@/Store/Finanace/FinanceInterface';
import { Receipt } from 'lucide-react';



export function ExpenseHeader({ 
  title = "Yangi Chiqim", 
  description = "Xarajat qoʻshish" 
}: ExpenseHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-3 rounded-xl">
        <Receipt className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}