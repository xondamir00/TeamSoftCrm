import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/Service/api";

interface UpdateTeacherProps {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  onSuccess: () => void;
}

export default function UpdateTeacherForm({ teacher, onSuccess }: UpdateTeacherProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    phone: teacher.phone,
    password: "",
    photoUrl: "",
    monthlySalary: null as string | null,
    percentShare: null as string | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === "monthlySalary" || name === "percentShare"
          ? value ? String(value) : null
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = { ...form };
      await api.patch(`/teachers/${teacher.id}`, payload);
      setMessage(t("updated_successfully"));
      onSuccess();
    } catch (err: any) {
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
