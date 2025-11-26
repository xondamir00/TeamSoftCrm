import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Sheet, StudentStatus } from "@/Store";

const Teacherdetail = () => {
  const { groupId } = useParams();
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [lessonNumber, setLessonNumber] = useState(1);

  // Sheet fetch funksiyasi
  const fetchSheet = useCallback(
    async (date: string, lesson: number) => {
      if (!groupId) return;
      try {
        setLoading(true);
        const { data } = await api.get<Sheet>(
          `/teacher/attendance/group/${groupId}`,
          { params: { date, lesson } }
        );

        if (data) {
          setSheets((prev) => {
            const existIndex = prev.findIndex(
              (s) => s.sheetId === data.sheetId
            );
            if (existIndex >= 0) {
              const newSheets = [...prev];
              newSheets[existIndex] = data;
              return newSheets;
            }
            return [...prev, data];
          });
        } else {
          alert("Sheet yaratilmadi");
        }
      } catch (err) {
        console.error(err);
        alert("Sheet yaratishda xatolik");
      } finally {
        setLoading(false);
      }
    },
    [groupId]
  );

  const handleCreateSheet = () => {
    fetchSheet(selectedDate, lessonNumber);
    setOpenModal(false);
  };

  // Status yangilash dropdown uchun
  const handleStatusChange = (
    sheetId: string,
    studentId: string,
    newStatus: StudentStatus
  ) => {
    setSheets((prev) =>
      prev.map((s) => {
        if (s.sheetId !== sheetId) return s;
        return {
          ...s,
          students: s.students.map((st) => {
            if (st.studentId !== studentId) return st;
            return { ...st, status: newStatus };
          }),
        };
      })
    );
  };

  const handleSave = async (sheetId: string) => {
    const sheet = sheets.find((s) => s.sheetId === sheetId);
    if (!sheet) return;
    setSaving(true);
    try {
      await api.patch(`/teacher/attendance/sheet/${sheet.sheetId}`, {
        items: sheet.students.map((s) => ({
          studentId: s.studentId,
          status: s.status,
          comment: s.comment,
        })),
      });
      setSheets((prev) =>
        prev.map((s) =>
          s.sheetId === sheetId ? { ...s, status: "CLOSED" } : s
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (groupId) setOpenModal(true);
  }, [groupId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Davomat - {groupId}</h1>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-80">
            <h2 className="text-lg font-semibold mb-4">Sana va Dars tanlang</h2>
            <div className="mb-4">
              <label className="block mb-1">Sana:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Dars raqami:</label>
              <input
                type="number"
                min={1}
                value={lessonNumber}
                onChange={(e) => setLessonNumber(Number(e.target.value))}
                className="border px-2 py-1 rounded w-full"
              />
            </div>
            <Button className="w-full mb-2" onClick={handleCreateSheet}>
              Jadval yaratish
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => setOpenModal(false)}
            >
              Bekor qilish
            </Button>
          </div>
        </div>
      )}

      {/* Sheets */}
      {sheets.map((sheet) => (
        <Card key={sheet.sheetId}>
          <CardContent className="overflow-x-auto ">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr>
                  <th className="border px-4 py-2 sticky left-0 bg-white z-10">
                    O'quvchi
                  </th>
                  <th className="border px-4 py-2">
                    {new Date(sheet.date).toLocaleDateString("uz-UZ", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </th>
                </tr>
              </thead>

              <tbody className="">
                {sheet.students.map((student) => (
                  <tr key={student.studentId}>
                    <td className="border px-4 h-[5vh] sticky left-0 bg-white flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          student.fullName
                        )}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      {student.fullName}
                    </td>

                    {/* Status dropdown */}
                    <td className="border px-4 h-[5vh] text-center">
                      {sheet.status === "OPEN" ? (
                        <select
                          value={student.status}
                          onChange={(e) =>
                            handleStatusChange(
                              sheet.sheetId,
                              student.studentId,
                              e.target.value as StudentStatus
                            )
                          }
                          className="border px-3 py-2 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PRESENT">✔️ Present</option>
                          <option value="ABSENT">❌ Absent</option>
                          <option value="UNKNOWN">- Noma'lum</option>
                        </select>
                      ) : (
                        <div className="flex justify-center items-center">
                          {student.status === "PRESENT" && (
                            <span className="text-green-600 font-medium">
                              ✔️ Present
                            </span>
                          )}
                          {student.status === "ABSENT" && (
                            <span className="text-red-600 font-medium">
                              ❌ Absent
                            </span>
                          )}
                          {student.status === "UNKNOWN" && (
                            <span className="text-gray-500 font-medium">
                              - Noma'lum
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sheet.status === "OPEN" && (
              <div className="mt-4">
                <Button
                  onClick={() => handleSave(sheet.sheetId)}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </div>
            )}

            {sheet.status === "CLOSED" && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                ✅ Jadval muvaffaqiyatli saqlandi va bloklandi
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Teacherdetail;
