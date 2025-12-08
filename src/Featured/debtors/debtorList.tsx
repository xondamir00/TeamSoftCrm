import type { DebtorListProps } from "@/Store/Finanace/FinanceInterface";
import { DebtorItem } from "./DebtorItem";


export function DebtorList({ debtors, onSendReminder, onRefresh }: DebtorListProps) {
  return (
    <div className="space-y-4">
      {debtors.map((debtor, index) => (
        <DebtorItem
          key={debtor.studentId}
          debtor={debtor}
          index={index}
          onSendReminder={onSendReminder}
        />
      ))}
    </div>
  );
}