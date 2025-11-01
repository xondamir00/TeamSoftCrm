import React, { useState } from "react";
import { api } from "@/Service/api"; // yoki axios.create instance

export default function AddManagerForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    photoUrl: "",
    monthlySalary: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        password: form.password,
        photoUrl:
          form.photoUrl.trim().startsWith("http") && form.photoUrl.length > 5
            ? form.photoUrl.trim()
            : null,
        monthlySalary: form.monthlySalary
          ? Number(form.monthlySalary)
          : undefined,
      };

      const res = await api.post("/managers", payload);
      console.log("✅ Manager added:", res.data);

      setMessage("Manager muvaffaqiyatli qo‘shildi!");
      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        photoUrl: "",
        monthlySalary: "",
      });
    } catch (err: any) {
      console.error(err);
      setMessage(
        err?.response?.data?.message || "Xatolik yuz berdi (400 Bad Request)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] border mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Add New Manager
      </h2>

      {message && (
        <div
          className={`text-sm mb-3 text-center ${
            message.includes("xatolik") || message.includes("Bad")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="border p-2 rounded"
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="border p-2 rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone (+998...)"
          required
          className="border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="border p-2 rounded"
        />
        <input
          name="photoUrl"
          value={form.photoUrl}
          onChange={handleChange}
          placeholder="Photo URL (optional)"
          className="border p-2 rounded"
        />
        <input
          name="monthlySalary"
          type="number"
          value={form.monthlySalary}
          onChange={handleChange}
          placeholder="Monthly Salary (optional)"
          className="border p-2 rounded"
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Yuborilmoqda..." : "Qo‘shish"}
        </button>
      </form>
    </div>
  );
}
