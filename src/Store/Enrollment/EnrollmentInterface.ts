import type { Group } from "../Group/GroupInterface";
import type { Student } from "../Student/StudentInterface";

export interface Enrollment {
  id: string;
  studentId: string;
  groupId: string;
  status: "ACTIVE" | "PAUSED" | "LEFT";
  leaveDate?: string;
  student?: { id: string; fullName: string }; // ← Optional qiling
  group?: { id: string; name: string }; // ← Optional qiling
  createdAt?: string;
  updatedAt?: string;
  joinDate?: string;
}

export interface EnrollmentStore {
  // State
  students: Student[];
  groups: Group[];
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;

  // Setters
  setStudents: (students: Student[]) => void;
  setGroups: (groups: Group[]) => void;
  setEnrollments: (enrollments: Enrollment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions
  fetchStudents: () => Promise<Student[]>;
  fetchGroups: () => Promise<Group[]>;
  fetchEnrollments: () => Promise<Enrollment[]>;
  createEnrollment: (data: {
    studentId: string;
    groupId: string;
    joinDate?: string;
  }) => Promise<Enrollment>;
  updateEnrollment: (
    id: string,
    data: Partial<{
      studentId?: string;
      groupId?: string;
      joinDate?: string;
      status?: string;
    }>
  ) => Promise<Enrollment>;
  deleteEnrollment: (id: string) => Promise<void>;
  fetchAllData: () => Promise<void>;
}
