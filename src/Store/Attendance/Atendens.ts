// stores/attendanceStore.ts
import type { Sheet } from "../Teacher/SheetInterdace";
import type { Group } from "../../Service/GroupService/GroupService";
import type { StudentStatus } from "../Student/StudentInterface";

export interface AttendanceState {
  sheets: Sheet[];
  group: Group | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  editingSheetId: string | null;
  editingStudentId: string | null;
  comment: string;

  // Actions
  fetchGroupInfo: (groupId: string) => Promise<void>;
  getOrCreateSheet: (
    groupId: string,
    date: string,
    lesson: number
  ) => Promise<void>;
  updateLocalStatus: (
    sheetId: string,
    studentId: string,
    status: StudentStatus
  ) => void;
  setEditingComment: (sheetId: string, studentId: string) => void;
  saveComment: () => void;
  updateCommentText: (comment: string) => void;
  saveSheet: (sheetId: string) => Promise<void>;
  deleteSheet: (sheetId: string) => Promise<void>;
  clearError: () => void;
  resetEditing: () => void;
}
export interface SheetHeaderProps {
  sheet: Sheet;
  stats: {
    present: number;
    absent: number;
    total: number;
  };
  onSave: (sheetId: string) => void;
  onDelete: (sheetId: string) => void;
  saving: boolean;
}


export interface StudentsListProps {
  sheet: Sheet;
  onStatusChange: (sheetId: string, studentId: string, status: StudentStatus) => void;
  onAddComment: (sheetId: string, studentId: string) => void;
  saving?: boolean;
}

export interface SheetCardProps {
  sheet: Sheet;
  onStatusChange: (sheetId: string, studentId: string, status: StudentStatus) => void;
  onAddComment: (sheetId: string, studentId: string) => void;
  onSave: (sheetId: string) => void;
  onDelete: (sheetId: string) => void;
  saving: boolean;
}