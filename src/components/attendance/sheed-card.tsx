// components/attendance/SheetCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Sheet, StudentStatus } from "@/Store/index";
import SheetHeader from "./sheed-header";
import StudentsList from "./attendance-list";

interface SheetCardProps {
  sheet: Sheet;
  onStatusChange: (sheetId: string, studentId: string, status: StudentStatus) => void;
  onAddComment: (sheetId: string, studentId: string) => void;
  onSave: (sheetId: string) => void;
  onDelete: (sheetId: string) => void;
  saving: boolean;
}

const SheetCard = ({ 
  sheet, 
  onStatusChange, 
  onAddComment, 
  onSave, 
  onDelete,
  saving 
}: SheetCardProps) => {
  const getSheetStats = () => {
    const present = sheet.students.filter(s => s.status === "PRESENT").length;
    const absent = sheet.students.filter(s => s.status === "ABSENT").length;
    const total = sheet.students.length;

    return { present, absent, total };
  };

  const stats = getSheetStats();

  return (
    <Card key={sheet.sheetId} className="overflow-hidden gap-0 ">
      <SheetHeader
        sheet={sheet}
        stats={stats}
        onSave={onSave}
        onDelete={onDelete}
        saving={saving}
        
      />
      <CardContent className="p-0">
        <StudentsList
          sheet={sheet}
          onStatusChange={onStatusChange}
          onAddComment={onAddComment}
          saving={saving}
        />
      </CardContent>
    </Card>
  );
};

export default SheetCard;