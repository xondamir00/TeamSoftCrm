import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { GroupModalStore } from "@/Store/Group/GroupInterface";
import useGroupStore from "@/Service/GroupService/GroupService";

export default function AddGroupForm({
  editingGroup,
  onSuccess,
}: GroupModalStore) {
  const { t } = useTranslation();
  
  const { 
    rooms, 
    loading, 
    createGroup, 
    updateGroup,
    fetchRooms,
    setLoading,
  } = useGroupStore();
  
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    roomId: "",
    capacity: 1,
    monthlyFee: 0,
    schedule: {
      mode: "ODD" as "ODD" | "EVEN" | "CUSTOM",
      startTime: "",
      endTime: "",
      days: [] as string[],
    },
  });
  
  // Xonalarni yuklash
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Agar editingGroup bo'lsa, formni to'ldirish
  useEffect(() => {
    if (editingGroup) {
      setForm({
        name: editingGroup.name || "",
        roomId: editingGroup.id || editingGroup.room?.id || "",
        capacity: editingGroup.capacity ?? 1,
        monthlyFee: editingGroup.monthlyFee ?? 0,
        schedule: {
          mode: editingGroup.daysPattern as "ODD" | "EVEN" | "CUSTOM" || "ODD",
          startTime: editingGroup.startTime || "",
          endTime: editingGroup.endTime || "",
          days: editingGroup.schedule?.days || [],
        },
      });
    } else {
      // Yangi guruh uchun formni tozalash
      setForm({
        name: "",
        roomId: "",
        capacity: 1,
        monthlyFee: 0,
        schedule: {
          mode: "ODD",
          startTime: "",
          endTime: "",
          days: [],
        },
      });
    }
  }, [editingGroup]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (["mode", "startTime", "endTime"].includes(name)) {
      setForm((f) => ({ 
        ...f, 
        schedule: { ...f.schedule, [name]: value } 
      }));
    } else if (name === "capacity" || name === "monthlyFee") {
      setForm((f) => ({ 
        ...f, 
        [name]: Number(value) || 0 
      }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: value,
      }));
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
    setMessage("");
    setLoading(true);

    try {
      // Payload tayyorlash
      const payload = {
        name: form.name.trim(),
        capacity: form.capacity,
        monthlyFee: form.monthlyFee,
        daysPattern: form.schedule.mode,
        startTime: form.schedule.startTime,
        endTime: form.schedule.endTime,
        days: form.schedule.mode === "CUSTOM" ? form.schedule.days : undefined,
        roomId: form.roomId || undefined,
      };

      if (editingGroup) {
        // Guruhni yangilash
        await updateGroup(editingGroup.id, payload);
        setMessage(t("group_updated_success") || "Group updated successfully!");
      } else {
        // Yangi guruh yaratish
        await createGroup(payload);
        setMessage(t("group_added_success") || "Group added successfully!");
      }

      // Muvaffaqiyatli bo'lsa, parent komponentga xabar berish
      setTimeout(() => {
        onSuccess?.();
      }, 500);
      
    } catch (err: any) {
      console.error("Error saving group:", err);
      
      // Xatolik xabarini ko'rsatish
      const errorMessage = err.response?.data?.message || 
        err.message || 
        t("group_error") || 
        "An error occurred";
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {editingGroup ? t("update_group") : t("add_group")}
      </h2>

      {message && (
        <div className={`mb-3 p-3 rounded-lg text-sm text-center ${
          message.includes("success") 
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Guruh nomi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("group_name") || "Group Name"}
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t("group_name_placeholder") || "Enter group name"}
            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            disabled={loading}
          />
        </div>

        {/* Xona tanlash */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("select_room") || "Room (Optional)"}
          </label>
          <select
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={loading}
          >
            <option value="">{t("select_room_optional") || "Select a room (optional)"}</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} {room.capacity ? `(${room.capacity} seats)` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Oylik to'lov */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("monthly_fee") || "Monthly Fee"}
            </label>
            <input
              type="number"
              name="monthlyFee"
              value={form.monthlyFee}
              onChange={handleChange}
              placeholder={t("monthly_fee_placeholder") || "0"}
              min={0}
              step="0.01"
              className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
              disabled={loading}
            />
          </div>

          {/* Sig'im */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("group_capacity") || "Capacity"}
            </label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              min={1}
              placeholder={t("group_capacity_placeholder") || "1"}
              className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Jadval turi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("schedule_type") || "Schedule Type"}
          </label>
          <select
            name="mode"
            value={form.schedule.mode}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={loading}
          >
            <option value="ODD">{t("odd_days_label") || "Odd Days"}</option>
            <option value="EVEN">{t("even_days_label") || "Even Days"}</option>
            <option value="CUSTOM">{t("custom_days_label") || "Custom Days"}</option>
          </select>
        </div>

        {/* Vaqt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("start_time") || "Start Time"}
            </label>
            <input
              type="time"
              name="startTime"
              value={form.schedule.startTime}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("end_time") || "End Time"}
            </label>
            <input
              type="time"
              name="endTime"
              value={form.schedule.endTime}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Custom kunlar (agar CUSTOM tanlangan bo'lsa) */}
        {form.schedule.mode === "CUSTOM" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("select_days") || "Select Days"}
            </label>
            <div className="flex flex-wrap gap-3">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg border transition ${
                    form.schedule.days.includes(day)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {t(day.toLowerCase()) || day}
                </button>
              ))}
            </div>
            {form.schedule.days.length > 0 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Selected: {form.schedule.days.map(d => t(d.toLowerCase())).join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {editingGroup 
                ? t("updating") || "Updating..." 
                : t("adding") || "Adding..."}
            </>
          ) : (
            editingGroup 
              ? t("update_button") || "Update Group" 
              : t("add_button") || "Add Group"
          )}
        </button>
      </form>
    </div>
  );
}