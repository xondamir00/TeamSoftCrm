// src/pages/TeacherAttendancePage.tsx
import React, { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { AttendanceSheetComponent } from "./AttendanceSheetComponent";

interface Group {
  id: string;
  name: string;
  room: { id: string; name: string } | null;
}

export const TeacherAttendancePage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);

  // API dan guruhlarni olish
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await api.get<Group[]>("/groups/my-groups");
        setGroups(res.data);
        if (res.data.length > 0) setSelectedGroupId(res.data[0].id); // default birinchi guruh
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <div className="p-4">Guruhlar yuklanmoqda...</div>;
  if (groups.length === 0) return <div className="p-4 text-red-500">Sizning guruhlaringiz topilmadi</div>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Davomat</h1>

      {/* Guruh tanlash */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Guruh tanlang:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedGroupId ?? ""}
          onChange={(e) => setSelectedGroupId(e.target.value)}
        >
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} ({g.room?.name ?? "Xona yo‘q"})
            </option>
          ))}
        </select>
      </div>

      {/* Sana tanlash */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Sana tanlang:</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Attendance Sheet */}
      {selectedGroupId && (
        <AttendanceSheetComponent groupId={selectedGroupId} date={selectedDate} />
      )}
    </div>
  );
};
