import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import type { ExpenseAlertProps } from '@/Store/Finanace/FinanceInterface';
import { Receipt, FileText } from 'lucide-react';


export function ExpenseAlert({ open, onOpenChange, alertContent }: ExpenseAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${
              alertContent.type === 'success' 
                ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {alertContent.type === 'success' ? (
                <Receipt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <AlertDialogTitle className={
              alertContent.type === 'success' 
                ? 'text-emerald-700 dark:text-emerald-300' 
                : 'text-red-700 dark:text-red-300'
            }>
              {alertContent.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
            {alertContent.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel className="rounded-lg hover:bg-slate-100">
            Yopish
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onOpenChange(false)}
            className={`rounded-lg ${
              alertContent.type === 'success' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            OK
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}