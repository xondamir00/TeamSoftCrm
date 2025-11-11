"use client";

import { useState } from "react";
import { api } from "@/Service/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function UpdateTeacherForm({ teacher, onSuccess }: any) {
  const [form, setForm] = useState({
    firstName: teacher.fullName?.split(" ")[0] || "",
    lastName: teacher.fullName?.split(" ")[1] || "",
    phone: teacher.phone || "",
    password: "",
    photoUrl: teacher.photoUrl || "",
    monthlySalary: teacher.monthlySalary || "",
    percentShare: teacher.percentShare || "",
  });

  const handleChange = (key: string, val: any) => {
    setForm((p) => ({ ...p, [key]: val }));

    if (key === "monthlySalary" && val) setForm((p) => ({ ...p, percentShare: "" }));
    if (key === "percentShare" && val) setForm((p) => ({ ...p, monthlySalary: "" }));
  };

  const handleSubmit = async () => {
    try {
      await api.patch(`/teachers/${teacher.id}`, form);
      alert("✅ Malumot yangilandi!");
      onSuccess?.();
    } catch (err: any) {
      alert("❌ Xatolik: " + (err.response?.data?.message || "Server xatosi"));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Ism</Label>
        <Input value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
      </div>

      <div>
        <Label>Familiya</Label>
        <Input value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
      </div>

      <div>
        <Label>Telefon</Label>
        <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
      </div>

      <div>
        <Label>Yangi parol</Label>
        <Input type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} />
      </div>

      <div>
        <Label>Avatar URL</Label>
        <Input value={form.photoUrl} onChange={(e) => handleChange("photoUrl", e.target.value)} />
      </div>

      <div>
        <Label>Oylik (UZS)</Label>
        <Input
          value={form.monthlySalary}
          disabled={Boolean(form.percentShare)}
          onChange={(e) => handleChange("monthlySalary", e.target.value)}
        />
      </div>

      <div>
        <Label>Foiz ulushi (%)</Label>
        <Input
          value={form.percentShare}
          disabled={Boolean(form.monthlySalary)}
          onChange={(e) => handleChange("percentShare", e.target.value)}
        />
      </div>

      <Button className="w-full bg-green-600 text-white" onClick={handleSubmit}>
        Saqlash
      </Button>
    </div>
  );
}
