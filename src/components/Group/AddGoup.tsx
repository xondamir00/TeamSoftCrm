"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/Service/api";
import { useTranslation } from "react-i18next";

interface AddGroupFormProps {
  editingGroup?: { id: string; name: string; room?: { id: string; name: string } } | null;
  onSuccess?: () => void;
}

export default function AddGroupForm({ editingGroup, onSuccess }: AddGroupFormProps) {
  const { t } = useTranslation();
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

  useEffect(() => {
    if (editingGroup) {
      setForm({
        name: editingGroup.name || "",
        roomId: editingGroup.room?.id || "",
      });
    } else {
      setForm({ name: "", roomId: "" });
    }
  }, [editingGroup]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingGroup) {
        await api.patch(`/groups/${editingGroup.id}`, {
          name: form.name,
          roomId: form.roomId || null,
        });
        setMessage(t("group_updated_success"));
      } else {
        await api.post("/groups", {
          name: form.name,
          roomId: form.roomId || undefined,
        });
        setMessage(t("group_added_success"));
      }

      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || t("group_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingGroup ? t("update_group") : t("add_group")}
      </h2>

      {message && (
        <p className="text-sm mb-3 text-center text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? t("loading") : editingGroup ? t("update_button") : t("add_button")}
        </button>
      </form>
    </div>
  );
}
