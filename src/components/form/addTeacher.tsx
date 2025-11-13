import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/Service/api";
import type { CreateTeacherPayload } from "@/Store";

export default function AddTeacherForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<CreateTeacherPayload>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    photoUrl: "",
    monthlySalary: null,
    percentShare: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "monthlySalary" || name === "percentShare") {
      setForm((f) => ({ ...f, [name]: value ? String(value) : null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        photoUrl: form.photoUrl && form.photoUrl.startsWith("http") ? form.photoUrl : null,
      };

      if (payload.monthlySalary && payload.percentShare) {
        setMessage(t("salary_warning"));
        setLoading(false);
        return;
      }

      const res = await api.post("/teachers", payload);
      console.log("✅ Success:", res.data);
      setMessage(t("success"));

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        photoUrl: "",
        monthlySalary: null,
        percentShare: null,
      });
    } catch (err: any) {
      console.error("❌ Error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] max-w-lg mx-auto mt-10 bg-white dark:bg-black p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">{t("add_teacher")}</h2>

      {message && (
        <div className="text-center text-sm mb-4 text-green-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder={t("first_name")}
          className="border p-2 rounded"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder={t("last_name")}
          className="border p-2 rounded"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder={t("phone")}
          className="border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder={t("password")}
          className="border p-2 rounded"
          required
        />
        <input
          name="photoUrl"
          value={form.photoUrl || ""}
          onChange={handleChange}
          placeholder={t("photo_url")}
          className="border p-2 rounded"
        />
        <input
          name="monthlySalary"
          value={form.monthlySalary ?? ""}
          onChange={handleChange}
          type="number"
          placeholder={t("monthly_salary")}
          className="border p-2 rounded"
        />
        <input
          name="percentShare"
          value={form.percentShare ?? ""}
          onChange={handleChange}
          type="number"
          placeholder={t("percent_share")}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#3F8CFF] text-white rounded p-2 hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? t("loading") : t("add_button")}
        </button>
      </form>
    </div>
  );
}
