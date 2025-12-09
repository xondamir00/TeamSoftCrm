import type { Payment } from "../Finanace/FinanceInterface";

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string; // required qilish
  phone: string;
  dateOfBirth: string; // required qilish
  startDate: string; // required qilish
  isActive: boolean;
  address?: string; // ixtiyoriy qilish
  email?: string;
  avatar?: string;
  groups?: Array<{
    name: string;
    course?: string;
    schedule?: string;
  }>;
}
export type StudentStatus = "PRESENT" | "ABSENT" | "UNKNOWN";
export interface StudentForm {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  startDate: string;
  isActive: boolean;
}

export interface StudentWithGroups {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  startDate?: string;
  address?: string;
  isActive: boolean;
  groups: StudentGroup[];
  totalGroups: number;
}
export interface StudentDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export interface DeleteStudentProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}
export interface StudentFinanceSummary {
  studentId: string;
  totalCharges: number;
  totalPaid: number;
  debt: number;
  lastPayments: Payment[];
}
export interface StudentStore {
  students: Student[];
  totalPages: number;
  loading: boolean;
  error: string | null;

  fetchStudents: (
    search?: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  getStudentById: (id: number) => Promise<Student>;
  createStudent: (data: Partial<Student>) => Promise<void>;
  updateStudent: (id: number, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
  restoreStudent: (id: number) => Promise<void>;
}
export interface StudentStatsProps {
  totalStudents: number;
  activeCount: number;
  inactiveCount: number;
}
export interface StudentProfileProps {
  student: {
    fullName: string;
    email?: string;
    isActive: boolean;
    avatar?: string;
  };
  studentId: string;
  getInitials: (name: string) => string;
}

export interface StudentSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export interface StudentTableProps {
  students: Student[];
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export interface StudentGroup {
  enrollmentId: string;
  groupId: string;
  name: string;
  room?: {
    id: string;
    name: string;
  };
  teacher?: {
    id: string;
    fullName: string;
  };
  daysPattern?: string;
  startTime?: string;
  endTime?: string;
  monthlyFee?: number;
  joinDate: string;
  status: string;
}

export interface StudentDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void; // ← onAdded qo'shing
}
