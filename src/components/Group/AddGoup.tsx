"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/Service/api";

export default function AddGroupForm() {
  const [form, setForm] = useState({ name: "", roomId: "" });
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setMessage("Group nomi kiritish shart!");
    setLoading(true);
    setMessage("");

    try {
      await api.post("/groups", {
        name: form.name,
        roomId: form.roomId || undefined,
      });
      setMessage("✅ Group muvaffaqiyatli qo‘shildi!");
      setForm({ name: "", roomId: "" });
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[50%] mx-auto border  p-6 rounded-xl shadow-md dark:bg-card">
      <h2 className="text-2xl my-6 font-semibold mb-4 text-center">
        Add New Group
      </h2>

      {message && (
        <p className="text-center text-sm mb-3 text-red-600">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex dark:text-white flex-col gap-3"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Group nomi"
          className="border  p-2 rounded"
          required
        />

        <select
          name="roomId"
          value={form.roomId}
          onChange={handleChange}
          className="  border  p-2  rounded-md w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-card  dark:border-gray-700  dark:text-gray-200 dark:focus:ring-gray-500
  "
        >
          <option value="">Xona tanlang (ixtiyoriy)</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? "Yuborilmoqda..." : "Qo‘shish"}
        </button>
      </form>
    </div>
  );
}
