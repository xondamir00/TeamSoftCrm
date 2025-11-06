"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/Service/api";
import { useTranslation } from "react-i18next";

interface AddGroupFormProps {
  editingGroup?: {
    id: string;
    name: string;
    room?: { id: string; name: string };
    capacity?: number;
    schedule?: {
      mode: "ODD" | "EVEN" | "CUSTOM";
      startTime: string;
      endTime: string;
      days?: string[];
    };
  } | null;
  onSuccess?: () => void;
}

export default function AddGroupForm({ editingGroup, onSuccess }: AddGroupFormProps) {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    roomId: "",
    capacity: 1,
    schedule: {
      mode: "ODD" as "ODD" | "EVEN" | "CUSTOM",
      startTime: "",
      endTime: "",
      days: [] as string[],
    },
  });

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

  useEffect(() => {
    if (editingGroup) {
      setForm({
        name: editingGroup.name || "",
        roomId: editingGroup.room?.id || "",
        capacity: editingGroup.capacity || 1,
        schedule: {
          mode: editingGroup.schedule?.mode || "ODD",
          startTime: editingGroup.schedule?.startTime || "",
          endTime: editingGroup.schedule?.endTime || "",
          days: editingGroup.schedule?.days || [],
        },
      });
    }
  }, [editingGroup]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (["mode", "startTime", "endTime"].includes(name)) {
      setForm((f) => ({ ...f, schedule: { ...f.schedule, [name]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleDayToggle = (day: string) => {
    setForm((f) => {
      const days = f.schedule.days.includes(day)
        ? f.schedule.days.filter((d) => d !== day)
        : [...f.schedule.days, day];
      return { ...f, schedule: { ...f.schedule, days } };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingGroup) {
        // Faqat jadvalni yangilash (PATCH /schedule)
        const schedulePayload = {
          mode: form.schedule.mode,
          startTime: form.schedule.startTime,
          endTime: form.schedule.endTime,
          ...(form.schedule.mode === "CUSTOM" ? { days: form.schedule.days } : {}),
        };

        await api.patch(`/groups/${editingGroup.id}/schedule`, schedulePayload);
        setMessage(t("group_updated_success"));
      } else {
        // Yangi guruh yaratish (POST /groups)
        const payload = {
          name: form.name,
          roomId: form.roomId || undefined,
          capacity: Number(form.capacity),
          schedule: {
            mode: form.schedule.mode,
            startTime: form.schedule.startTime,
            endTime: form.schedule.endTime,
            ...(form.schedule.mode === "CUSTOM" ? { days: form.schedule.days } : {}),
          },
        };
        await api.post("/groups", payload);
        setMessage(t("group_added_success"));
      }

      setTimeout(() => onSuccess?.(), 500);
    } catch (err: any) {
      console.error("Error:", err.response?.data);
      setMessage(err.response?.data?.message || t("group_error"));
    } finally {
      setLoading(false);
    }
  };

  // Backend enum DayOfWeek ga mos (Prisma: MON, TUE, WED, THU, FRI, SAT, SUN)
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingGroup ? t("update_group") : t("add_group")}
      </h2>

      {message && (
        <p className="text-sm mb-3 text-center text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {!editingGroup && (
          <>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("group_name")}
              className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
              required
            />

            <select
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">{t("select_room_optional")}</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              min={1}
              placeholder={t("group_capacity")}
              className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </>
        )}

        <select
          name="mode"
          value={form.schedule.mode}
          onChange={handleChange}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="ODD">{t("odd_days_label")}</option>
          <option value="EVEN">{t("even_days_label")}</option>
          <option value="CUSTOM">{t("custom_days_label")}</option>
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            name="startTime"
            value={form.schedule.startTime}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
            required
          />
          <input
            type="time"
            name="endTime"
            value={form.schedule.endTime}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
            required
          />
        </div>

        {form.schedule.mode === "CUSTOM" && (
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.schedule.days.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                {t(day.toLowerCase())}
              </label>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-60"
        >
          {loading
            ? t("loading")
            : editingGroup
            ? t("update_button")
            : t("add_button")}
        </button>
      </form>
    </div>
  );
}
