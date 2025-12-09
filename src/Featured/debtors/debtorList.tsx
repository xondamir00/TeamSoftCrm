import type { DebtorListProps } from "@/Store/Finanace/FinanceInterface";
import { DebtorItem } from "@/Featured/Debtors/DebtorItem";

export function DebtorList({ debtors }: DebtorListProps) {
  return (
    <div className="space-y-4">
      {debtors.map((debtor, index) => (
        <DebtorItem key={debtor.studentId} debtor={debtor} index={index} />
      ))}
    </div>
  );
}
