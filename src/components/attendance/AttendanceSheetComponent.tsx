// src/pages/AttendanceSheet.tsx
import React, { useEffect, useState } from "react";
import { api } from "@/Service/api";

interface Student {
  id: string;
  fullName: string;
  attendance?: "present" | "absent"; // API dagi status
}

interface Props {
  groupId: string;
  date: string;
}

export const AttendanceSheetComponent: React.FC<Props> = ({ groupId, date }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // O‘quvchilar ro‘yxatini olish
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await api.get<Student[]>(`/groups/${groupId}/students?date=${date}`);
        // Agar attendance mavjud bo‘lsa, API dan olinadi
        setStudents(res.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [groupId, date]);

  const handleAttendanceChange = (studentId: string, status: "present" | "absent") => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, attendance: status } : s
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post(`/groups/${groupId}/attendance`, {
        date,
        students: students.map((s) => ({ id: s.id, attendance: s.attendance || "absent" })),
      });
      alert("Davomat saqlandi!");
    } catch (err) {
      console.error("Save Error:", err);
      alert("Davomatni saqlashda xatolik yuz berdi!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>O‘quvchilar yuklanmoqda...</div>;

  if (students.length === 0)
    return <div>Bu guruhda o‘quvchilar topilmadi.</div>;

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-semibold mb-2">Davomat: {date}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">#</th>
            <th className="border p-2 text-left">F.I.O</th>
            <th className="border p-2 text-left">Davomat</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{student.fullName}</td>
              <td className="border p-2">
                <select
                  value={student.attendance || "absent"}
                  onChange={(e) =>
                    handleAttendanceChange(student.id, e.target.value as "present" | "absent")
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="present">Kelgan</option>
                  <option value="absent">Kelmagan</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {saving ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </div>
  );
};
