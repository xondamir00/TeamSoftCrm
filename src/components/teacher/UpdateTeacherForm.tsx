"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/Service/api";
import { AxiosError } from "axios";

interface ApiError {
  message?: string;
}

interface UpdateTeacherProps {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  onSuccess: () => void;
}

export default function UpdateTeacherForm({
  teacher,
  onSuccess,
}: UpdateTeacherProps) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    phone: teacher.phone,
    password: "",
    photoUrl: "",
    monthlySalary: null as number | null,
    percentShare: null as number | null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "monthlySalary" || name === "percentShare") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        photoUrl:
          form.photoUrl && form.photoUrl.startsWith("http")
            ? form.photoUrl
            : null,
      };

      await api.patch(`/teachers/${teacher.id}`, payload);

      setMessage(t("updated_successfully"));
      onSuccess();
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      setMessage(err.response?.data?.message || t("update_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {message && <p className="text-center text-sm text-red-500">{message}</p>}

      <input
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder={t("first_name")}
        className="border p-2 rounded"
      />
      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder={t("last_name")}
        className="border p-2 rounded"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder={t("phone")}
        className="border p-2 rounded"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder={t("password_optional")}
        className="border p-2 rounded"
      />
      <input
        name="photoUrl"
        value={form.photoUrl}
        onChange={handleChange}
        placeholder={t("photo_url")}
        className="border p-2 rounded"
      />
      <input
        name="monthlySalary"
        type="number"
        value={form.monthlySalary ?? ""}
        onChange={handleChange}
        placeholder={t("monthly_salary")}
        className="border p-2 rounded"
      />
      <input
        name="percentShare"
        type="number"
        value={form.percentShare ?? ""}
        onChange={handleChange}
        placeholder={t("percent_share")}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-[#3F8CFF] text-white rounded p-2 hover:bg-blue-600 disabled:opacity-60"
      >
        {loading ? t("loading") : t("save_changes")}
      </button>
    </form>
  );
}
