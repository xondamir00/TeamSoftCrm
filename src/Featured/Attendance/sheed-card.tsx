"use client";

import { Card, CardContent } from "@/components/ui/card";
import SheetHeader from "@/Featured/Attendance/Sheed-header";
import StudentsList from "@/Featured/Attendance/Attendance-List";
import type { SheetCardProps } from "@/Store/Attendance/Atendens";

const SheetCard = ({
  sheet,
  onStatusChange,
  onAddComment,
  onSave,
  onDelete,
  saving,
}: SheetCardProps) => {
  const getSheetStats = () => {
    const present = sheet.students.filter((s) => s.status === "PRESENT").length;
    const absent = sheet.students.filter((s) => s.status === "ABSENT").length;
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
