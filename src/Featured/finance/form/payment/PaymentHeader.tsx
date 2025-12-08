import { User } from 'lucide-react';

interface PaymentHeaderProps {
  title?: string;
  description?: string;
}

export function PaymentHeader({ 
  title = "Yangi Toʻlov", 
  description = "Talabaga toʻlov qoʻshing" 
}: PaymentHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl">
        <User className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}