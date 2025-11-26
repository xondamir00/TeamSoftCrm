import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { useParams } from "react-router-dom";

const Teacherdetail = () => {
  const { groupId } = useParams();
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [lessonNumber, setLessonNumber] = useState(1);

  const fetchSheet = async () => {
    try {
      setLoading(true);
      setOpenModal(false);

      const { data } = await api.get(
        `/teacher/attendance/group/${groupId}?date=${selectedDate}&lesson=${lessonNumber}`
      );

      if (data) {
        setSheet(data);
      } else {
        setOpenModal(true);
      }
    } catch (error) {
      console.log("Fetch error:", error);
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Jadval yaratish aslida backend avtomatik qiladi,
  // shuning uchun faqat fetch qilishni chaqiramiz
  const handleCreateSheet = () => {
    fetchSheet();
  };

  useEffect(() => {
    if (groupId) fetchSheet();
  }, [groupId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Group Detail</h1>

      {/* ✅ Agar sheet bor bo‘lsa ko‘rsatamiz */}
      {sheet && <pre>{JSON.stringify(sheet, null, 2)}</pre>}

      {/* ✅ Sheet yo‘q bo‘lsa modal chiqadi */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-80">
            <h2 className="text-lg font-semibold mb-4">
              Bugungi davomat jadvali mavjud emas
            </h2>

            {/* ✅ Sana va dars raqami inputlari */}
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

            <button
              onClick={handleCreateSheet}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2"
            >
              Sheet yaratish
            </button>

            <button
              onClick={() => setOpenModal(false)}
              className="bg-gray-300 px-4 py-2 rounded w-full"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teacherdetail;
