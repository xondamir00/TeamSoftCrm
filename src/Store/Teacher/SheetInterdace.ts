import type { StudentStatus } from "../Student/StudentInterface";

export interface Sheet {
  sheetId: string;
  date: string;
  lesson: number;
  status: "OPEN" | "CLOSED";
  group: {
    id: string;
    name: string;
    room?: { name: string } | null;
  };
  students: Array<{
    studentId: string;
    fullName: string;
    status: StudentStatus;
    comment?: string | null;
  }>;
}
