import { Label } from '@/components/ui/label';
import type { ReactNode } from 'react';

interface ExpenseFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}

export function ExpenseField({ 
  label, 
  htmlFor, 
  required = false, 
  children, 
  error 
}: ExpenseFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-slate-700 dark:text-slate-300 font-medium">
        {label} {required && '*'}
      </Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}