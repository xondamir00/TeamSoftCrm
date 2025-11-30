"use client";

import { Check, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { StudentStatus, Student } from "@/Store";
import { useAttendanceStore } from "@/Store/Attendance";

interface StudentsListProps {
  students: Student[];
  sheetId: string;
  sheetStatus: "OPEN" | "CLOSED";
}

export default function StudentsList({
  students,
  sheetId,
  sheetStatus,
}: StudentsListProps) {
  const { updateLocalStatus } = useAttendanceStore();

  return (
    <div className="space-y-3">
      {students.map((student) => (
        <div
          key={student.studentId}
          className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          {/* Student Info */}
          <div className="flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                student.fullName
              )}`}
              className="w-10 h-10 rounded-full shadow"
            />
            <span>{student.fullName}</span>
          </div>

          {/* Status */}
          <div className="">
            {sheetStatus === "OPEN" ? (
              <Select
                value={student.status}
                onValueChange={(value) =>
                  updateLocalStatus(
                    sheetId,
                    student.studentId,
                    value as StudentStatus
                  )
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRESENT">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Present
                    </div>
                  </SelectItem>
                  <SelectItem value="ABSENT">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-600" />
                      Absent
                    </div>
                  </SelectItem>
                  <SelectItem value="UNKNOWN">Noma'lum</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant={
                  student.status === "PRESENT"
                    ? "secondary"
                    : student.status === "ABSENT"
                    ? "destructive"
                    : "outline"
                }
              >
                {student.status === "PRESENT" && "✔️ Present"}
                {student.status === "ABSENT" && "❌ Absent"}
                {student.status === "UNKNOWN" && "Noma'lum"}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
