"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/Service/api";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AddGroupForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState({ name: "", roomId: "" });
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  // 🔹 Xonalarni olish
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get("/rooms");
        setRooms(data);
      } catch {
        setRooms([]);
      }
    };
    fetchRooms();
  }, []);

  // 🔹 Input va select qiymatlarini yangilash
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Formani yuborish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return setMessage({ text: "Guruh nomi kiritish shart!", type: "error" });
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await api.post("/groups", {
        name: form.name,
        roomId: form.roomId || undefined,
      });

      setMessage({
        text: "✅ Guruh muvaffaqiyatli qo‘shildi!",
        type: "success",
      });
      setForm({ name: "", roomId: "" });

      // 🔄 Parent komponentni yangilash
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "❌ Xatolik yuz berdi!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-[420px] mx-auto border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md bg-white dark:bg-[#0d1117] transition-all duration-500">
      <h2 className="text-2xl font-semibold mb-4 text-center text-[#3F8CFF]">
        Yangi Guruh Qo‘shish
      </h2>

      {/* 🔔 Xabar */}
      {message.text && (
        <div
          className={`flex items-center gap-2 justify-center text-sm mb-4 p-2 rounded-md ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 🧾 Forma */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 text-gray-900 dark:text-gray-200"
      >
        {/* Guruh nomi */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Guruh nomi <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Masalan: Frontend-1"
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-[#0f172a] focus:ring-2 focus:ring-[#3F8CFF] focus:border-[#3F8CFF] outline-none"
          />
        </div>

        {/* Xona tanlash */}
        <div className="flex flex-col gap-1">
          <label htmlFor="roomId" className="text-sm font-medium">
            Xona (ixtiyoriy)
          </label>
          <select
            id="roomId"
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-[#0f172a] focus:ring-2 focus:ring-[#3F8CFF] focus:border-[#3F8CFF] outline-none"
          >
            <option value="">Xona tanlang</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🟦 Qo‘shish tugmasi */}
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center gap-2 bg-[#3F8CFF] hover:bg-[#3578e5] 
                     text-white font-semibold py-2 px-6 rounded-xl transition-all 
                     disabled:opacity-70 self-center max-w-fit"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Yuborilmoqda...</span>
            </>
          ) : (
            "Qo‘shish"
          )}
        </button>
      </form>
    </div>
  );
}
