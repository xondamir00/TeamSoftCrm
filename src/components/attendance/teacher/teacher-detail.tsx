"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Loader2, CalendarPlus } from "lucide-react";
import { motion } from "framer-motion";

import { useAttendanceStore } from "@/Store/Attendance";
import StudentsList from "../Attendance-List";

export default function Teacherdetail() {
  const { groupId } = useParams();

  const {
    sheets,
    loading,
    saving,
    fetchSheet,
    saveSheet,
    groupName,
    getLocalDate,
  } = useAttendanceStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [lessonNumber, setLessonNumber] = useState(1);

  // ✅ Component load bo'lganda bugungi sanani set qilamiz
  useEffect(() => {
    const today = getLocalDate();
    setSelectedDate(today);
  }, [getLocalDate]);

  // ✅ groupId mavjud bo'lganda modalni ochish
  useEffect(() => {
    if (groupId) {
      setOpenModal(true);
    }
  }, [groupId]);

  const handleCreateSheet = () => {
    if (!groupId || !selectedDate) {
      console.error("groupId yoki sana mavjud emas");
      return;
    }

    console.log("Sana yuborilmoqda:", selectedDate);

    // ✅ Zustand ga sana jo'natamiz (normalize qilish store-da bo'ladi)
    fetchSheet(groupId, selectedDate, lessonNumber);
    setOpenModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-[98%] mx-auto">
      {/* Header */}
      <div className="flex border p-3 rounded-t-2xl shadow-xs justify-between my-4 items-center">
        <h1 className="text-2xl font-semibold">
          Davomat – {groupName || "Guruh nomi..."}
        </h1>

        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setOpenModal(true)}
        >
          <CalendarPlus className="w-5 h-5" /> Yangi jadval
        </Button>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-lg w-80 shadow-xl"
          >
            <h2 className="text-lg font-semibold mb-4">Sana va Dars raqami</h2>

            {/* Sana input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Sana:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dars raqami input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Dars raqami:
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={lessonNumber}
                onChange={(e) => setLessonNumber(parseInt(e.target.value) || 1)}
                className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <Button
              className="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreateSheet}
            >
              Jadval yaratish
            </Button>

            <Button
              className="w-full"
              variant="secondary"
              onClick={() => setOpenModal(false)}
            >
              Bekor qilish
            </Button>
          </motion.div>
        </div>
      )}

      {/* Attendance Sheets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sheets && sheets.length > 0 ? (
          sheets.map((sheet) => (
            <Card key={sheet.sheetId} className="overflow-hidden w-full">
              <CardContent className="p-4">
                {/* Sana */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">
                    {new Date(sheet.date).toLocaleDateString("uz-UZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {sheet.lesson ? `${sheet.lesson}-dars` : ""}
                  </p>
                </div>

                {/* Students List */}
                <StudentsList
                  students={sheet.students}
                  sheetId={sheet.sheetId}
                  sheetStatus={sheet.status}
                />

                {/* Save / Closed Button */}
                <div className="mt-4">
                  {sheet.status === "OPEN" ? (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      disabled={saving}
                      onClick={() => saveSheet(sheet.sheetId)}
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saqlanmoqda...
                        </span>
                      ) : (
                        "Saqlash"
                      )}
                    </Button>
                  ) : (
                    <div className="text-center">
                      <Badge
                        variant="outline"
                        className="px-4 py-1 text-green-600 border-green-600"
                      >
                        ✓ Jadval saqlandi
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>
              Hali jadval mavjud emas. Yangi jadval yaratish uchun tugmani
              bosing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
