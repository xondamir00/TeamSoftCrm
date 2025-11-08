import { useEffect, useState } from "react";
import { api } from "@/Service/api";

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

const ListStudent = () => {
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
  }, [search, page]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (students.length === 0) return <p>No students found.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem",
          width: "100%",
          maxWidth: "400px",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {students.map((student) => (
          <div
            key={student.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{student.fullName}</h3>
            <p>Phone: {student.phone}</p>
            <p>Status: {student.isActive ? "Active" : "Inactive"}</p>
            {student.dateOfBirth && <p>DOB: {student.dateOfBirth}</p>}
            {student.startDate && <p>Start: {student.startDate}</p>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListStudent;
