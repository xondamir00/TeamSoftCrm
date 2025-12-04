"use client";

import { Check, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Sheet, StudentStatus } from "@/Store/index";

interface StudentsListProps {
  sheet: Sheet;
  onStatusChange: (sheetId: string, studentId: string, status: StudentStatus) => void;
  onAddComment: (sheetId: string, studentId: string) => void;
  saving?: boolean;
}

const StudentsList = ({ 
  sheet, 
  onStatusChange, 
  onAddComment,
  saving = false 
}: StudentsListProps) => {
  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case "PRESENT":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800"
          >
            <Check className="w-3 h-3 mr-1" />
            Present
          </Badge>
        );
      case "ABSENT":
        return (
          <Badge variant="destructive">
            <X className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Noma'lum
          </Badge>
        );
    }
  };

  if (sheet.students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Hech qanday o'quvchi topilmadi
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="text-left p-4 font-semibold min-w-[300px]">
              <div className="flex items-center gap-2">
                O'quvchi
              </div>
            </th>
            <th className="p-4 font-semibold text-center">Holati</th>
            <th className="p-4 font-semibold">Izoh</th>
            <th className="p-4 font-semibold text-center">Harakatlar</th>
          </tr>
        </thead>
        <tbody>
          {sheet.students.map((student, index) => (
            <tr
              key={student.studentId}
              className={
                index % 2 === 0
                  ? "bg-white  dark:bg-[rgba(0,0,0,0.1)]"
                  : "bg-gray-50 dark:bg-[rgba(0,0,0,0.1)]"
              }
            >
              <td className="p-4 min-w-[300px]">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      student.fullName
                    )}&background=random`}
                    alt={student.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{student.fullName}</span>
                </div>
              </td>
              <td className="p-4 text-center">
                {sheet.status === "OPEN" ? (
                  <Select
                    value={student.status}
                    onValueChange={(value) =>
                      onStatusChange(
                        sheet.sheetId,
                        student.studentId,
                        value as StudentStatus
                      )
                    }
                    disabled={saving}
                  >
                    <SelectTrigger className="w-40 mx-auto">
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
                      <SelectItem value="UNKNOWN">
                        Noma'lum
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex justify-center">
                    {getStatusBadge(student.status)}
                  </div>
                )}
              </td>
              <td className="p-4">
                <div className="max-w-xs">
                  {student.comment ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.comment}
                    </p>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Izoh yo'q
                    </span>
                  )}
                </div>
              </td>
              <td className="p-4 text-center">
                {sheet.status === "OPEN" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddComment(sheet.sheetId, student.studentId)}
                    disabled={saving}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;