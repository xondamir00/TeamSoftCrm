"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/Service/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  firstName: z.string().min(2, "Kamida 2 ta harf"),
  lastName: z.string().min(2, "Kamida 2 ta harf"),
  phone: z.string().min(7, "Telefon noto‘g‘ri"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat"),
  photoUrl: z.string().optional(),
  monthlySalary: z.string().optional(),
  percentShare: z.string().optional(),
});

export default function AddTeacherForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm({
    resolver: zodResolver(schema),
  });

  const salary = watch("monthlySalary");
  const percent = watch("percentShare");

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      if (data.monthlySalary && data.percentShare) {
        alert("⚠️ Faqat bittasini kiriting: Oylik yoki foiz!");
        return;
      }

      await api.post("/teachers", data);

      alert("✅ Ustoz muvaffaqiyatli qo‘shildi!");
      onSuccess?.();
    } catch (err: any) {
      alert("❌ Xatolik: " + (err.response?.data?.message || "Server xatosi"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label>Ism</Label>
        <Input {...register("firstName")} />
      </div>

      <div>
        <Label>Familiya</Label>
        <Input {...register("lastName")} />
      </div>

      <div>
        <Label>Telefon</Label>
        <Input {...register("phone")} placeholder="+998..." />
      </div>

      <div>
        <Label>Parol</Label>
        <Input type="password" {...register("password")} />
      </div>

      <div>
        <Label>Avatar URL</Label>
        <Input {...register("photoUrl")} placeholder="https://..." />
      </div>

      <div>
        <Label>Oylik (UZS)</Label>
        <Input
          {...register("monthlySalary")}
          disabled={Boolean(percent)}
          onChange={(e) => {
            setValue("percentShare", "");
            setValue("monthlySalary", e.target.value);
          }}
        />
      </div>

      <div>
        <Label>Foiz ulushi (%)</Label>
        <Input
          {...register("percentShare")}
          disabled={Boolean(salary)}
          onChange={(e) => {
            setValue("monthlySalary", "");
            setValue("percentShare", e.target.value);
          }}
        />
      </div>

      <Button className="w-full bg-blue-600 text-white" disabled={loading}>
        {loading ? "Saqlanmoqda..." : "Qo‘shish"}
      </Button>
    </form>
  );
}
