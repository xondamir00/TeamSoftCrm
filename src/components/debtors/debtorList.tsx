import type { Debtor } from "@/Store/debtor";
import { DebtorItem } from "./DebtorItem";

interface DebtorListProps {
  debtors: Debtor[];
  onSendReminder: (studentId: string) => void;
  onRefresh: () => void;
}

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