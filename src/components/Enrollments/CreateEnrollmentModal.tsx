import { useState, useEffect } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Student {
  id: string;
  fullName: string;
  phone?: string;
}

interface Group {
  id: string;
  name: string;
}

interface Props {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateEnrollmentModal({ onSuccess, onClose }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [studentId, setStudentId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [joinDate, setJoinDate] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Students & Groups fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStudents, resGroups] = await Promise.all([
          api.get("/students"),
          api.get("/groups"),
        ]);

        // Backenddan kelgan ma'lumotni to'g'ri destructure qilish
        setStudents(resStudents.data.items ?? []);
        setGroups(resGroups.data.items ?? []);
      } catch (err: any) {
        console.error(err);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!studentId || !groupId) {
        setError("Iltimos, student va guruhni tanlang");
        setLoading(false);
        return;
      }

      console.log("Submitting enrollment:", { studentId, groupId, joinDate });

      const res = await api.post("/enrollments", {
        studentId,
        groupId,
        joinDate: joinDate || undefined, // joinDate optional
      });

      console.log("Server response:", res.data);

      if (res.data.success === false) {
        setError("Enrollment yaratib bo'lmadi: " + JSON.stringify(res.data.message));
      } else {
        onSuccess?.();
        onClose?.();
      }
    } catch (err: any) {
      console.error("Error creating enrollment:", err);
      setError(err.response?.data?.message || "Serverda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Yangi Enrollment yaratish</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student select */}
        <div>
          <Label htmlFor="student">Student</Label>
          <select
            id="student"
            className="border rounded w-full p-2"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Tanlang</option>
            {(students ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Group select */}
        <div>
          <Label htmlFor="group">Guruh</Label>
          <select
            id="group"
            className="border rounded w-full p-2"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">Tanlang</option>
            {(groups ?? []).map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Join date */}
        <div>
          <Label htmlFor="joinDate">Join Date (optional)</Label>
          <Input
            id="joinDate"
            type="date"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose} disabled={loading}>
            Bekor qilish
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Yaratilmoqda..." : "Yaratish"}
          </Button>
        </div>
      </form>
    </div>
  );
}
