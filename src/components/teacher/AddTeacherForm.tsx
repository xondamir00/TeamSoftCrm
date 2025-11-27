"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/Service/api";
import type { CreateTeacherPayload } from "@/Store";
import { AxiosError } from "axios";

interface ApiError {
  message?: string;
}

export default function AddTeacherForm() {
  const { t } = useTranslation();

  const [form, setForm] = useState<CreateTeacherPayload>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    photoUrl: "",
    monthlySalary: undefined,
    percentShare: undefined,
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "monthlySalary" || name === "percentShare") {
      setForm((prev) => ({
        ...prev,
        [name]: value.trim() === "" ? undefined : value,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload: CreateTeacherPayload = {
        ...form,
        photoUrl:
          form.photoUrl && form.photoUrl.startsWith("http")
            ? form.photoUrl
            : undefined,
      };

      if (payload.monthlySalary && payload.percentShare) {
        setMessage(t("salary_warning"));
        setLoading(false);
        return;
      }

      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof CreateTeacherPayload] === undefined) {
          delete payload[key as keyof CreateTeacherPayload];
        }
      });

      await api.post("/teachers", payload);

      setMessage(t("success"));

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        photoUrl: "",
        monthlySalary: undefined,
        percentShare: undefined,
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
      <h2 className="text-xl font-semibold mb-4">{t("add_teacher")}</h2>

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
          placeholder={t("phone")}
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
          name="photoUrl"
          value={form.photoUrl || ""}
          onChange={handleChange}
          placeholder={t("photo_url")}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
        />

        <input
          name="monthlySalary"
          type="number"
          value={form.monthlySalary ?? ""}
          onChange={handleChange}
          placeholder={t("monthly_salary")}
          className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700"
        />

        <input
          name="percentShare"
          type="number"
          value={form.percentShare ?? ""}
          onChange={handleChange}
          placeholder={t("percent_share")}
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
