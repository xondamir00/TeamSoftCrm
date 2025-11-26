"use client";

import React, { useState } from "react";
import { api } from "@/Service/api";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

interface ApiError {
  message?: string;
}

export default function AddStudentForm() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    startDate: "",
    groupId: "",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        dateOfBirth: form.dateOfBirth || undefined,
        startDate: form.startDate || undefined,
        groupId: form.groupId || undefined,
      };

      // undefined fieldlarni tozalash:
      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof typeof payload] === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });

      await api.post("/students", payload);

      setMessage(t("success"));

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        dateOfBirth: "",
        startDate: "",
        groupId: "",
      });
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      setMessage(err.response?.data?.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t("add_student")}</h2>

      {message && (
        <p className="text-sm mb-3 text-center text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder={t("first_name")}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          required
        />

        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder={t("last_name")}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder={t("phone_number")}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          required
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder={t("password")}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
          required
        />

        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
        />

        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
        />

        <input
          name="groupId"
          value={form.groupId}
          onChange={handleChange}
          placeholder={t("group_id_optional")}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? t("loading") : t("add_button")}
        </button>
      </form>
    </div>
  );
}
