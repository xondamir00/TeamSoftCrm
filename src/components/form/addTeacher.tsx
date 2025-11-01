import React, { useState } from "react";
import { api } from "@/Service/api";
import type { CreateTeacherPayload } from "@/Store";

export default function AddTeacherForm() {
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
      setForm((f) => ({
        ...f,
        [name]: value ? Number(value) : null,
      }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Agar photoUrl bo'sh bo'lsa, null yuboramiz
      const payload = {
        ...form,
        photoUrl:
          form.photoUrl && form.photoUrl.startsWith("http")
            ? form.photoUrl
            : null,
      };

      if (payload.monthlySalary && payload.percentShare) {
        setMessage("Faqat bittasini kiriting: monthlySalary yoki percentShare");
        setLoading(false);
      }

      const res = await api.post("/teachers", payload);
      console.log("✅ Success:", res.data);
      setMessage("Teacher muvaffaqiyatli qo‘shildi!");

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
      setMessage(
        err.response?.data?.message || "Yuborishda xatolik yuz berdi (400)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%]  mx-auto  border bg-white p-6 rounded-xl shadow-md dark:bg-card">
      <h2 className="text-2xl my-6 font-semibold mb-4 text-center">
        Add New Teacher
      </h2>

      {message && (
        <div className="text-center text-sm mb-3 text-red-600">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="border p-2 rounded"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="border p-2 rounded"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border p-2 rounded"
          required
        />
        <input
          name="photoUrl"
          value={form.photoUrl || ""}
          onChange={handleChange}
          placeholder="Photo URL (https://...)"
          className="border p-2 rounded"
        />
        <input
          name="monthlySalary"
          value={form.monthlySalary ?? ""}
          onChange={handleChange}
          type="number"
          placeholder="Monthly Salary"
          className="border p-2 rounded"
        />
        <input
          name="percentShare"
          value={form.percentShare ?? ""}
          onChange={handleChange}
          type="number"
          placeholder="Percent Share (0-100)"
          className="border p-2 rounded"
        />
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
