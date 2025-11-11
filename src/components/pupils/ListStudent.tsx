import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader2, Pencil, Trash2, RotateCw } from "lucide-react";

interface Student {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  dateOfBirth?: string;
  startDate?: string;
  createdAt: string;
}

interface ListStudentProps {
  onDelete: (student: Student) => void;
  refreshKey: number;
}

const ListStudent = ({ onDelete, refreshKey }: ListStudentProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students", {
        params: { search, page, limit },
      });

      setStudents(res.data.items || []);
      setTotalPages(res.data.meta?.pages || 1);
    } catch (err: any) {
      console.error(err);
      setError("Studentlarni olishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, page, refreshKey]); // ✅ refreshKey qo'shildi

  if (loading)
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    );

  if (error) return <div className="text-red-600 p-4 rounded-md">{error}</div>;

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-sm">
                    {student.id}
                  </TableCell>

                  <TableCell>{student.fullName}</TableCell>

                  <TableCell>{student.phone}</TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell>{student.dateOfBirth || "-"}</TableCell>
                  <TableCell>{student.startDate || "-"}</TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      variant={student.isActive ? "destructive" : "secondary"}
                      size="icon"
                      onClick={() => onDelete(student)}
                    >
                      {student.isActive ? (
                        <Trash2 className="w-4 h-4" />
                      ) : (
                        <RotateCw className="w-4 h-4" />
                      )}
                    </Button>
                    <Button>
                      <Trash2
                        onClick={() => onDelete(student)}
                        className="text-red-800"
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        <span className="text-gray-600">
          Page <strong>{page}</strong> of {totalPages}
        </span>

        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ListStudent;
