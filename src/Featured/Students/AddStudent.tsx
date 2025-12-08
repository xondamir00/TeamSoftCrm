"use client";

import React, { useState } from "react";
import { api } from "@/Service/api";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { ApiError } from "@/Store";

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

      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof typeof payload] === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });

      await api.post("/students", payload);
      setMessage(t("success") || "Student added successfully!");

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
      setMessage(
        err.response?.data?.message || t("error") || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full p-2 dark:bg-slate-900">
      <CardHeader>
        <CardTitle>{t("add_student") || "Add New Student"}</CardTitle>
        <CardDescription>
          {t("add_student_description") ||
            "Fill in the student information below"}
        </CardDescription>
      </CardHeader>

      <CardContent className="dark:bg-slate-900">
        {message && (
          <Alert
            className={`mb-4 ${
              message.includes("error")
                ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300"
                : "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300"
            }`}
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name and Last Name - Horizontal on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t("first_name") || "First Name"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder={t("first_name_placeholder") || "John"}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t("last_name") || "Last Name"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder={t("last_name_placeholder") || "Doe"}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              {t("phone_number") || "Phone Number"}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder={t("phone_placeholder") || "+998901234567"}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {t("password") || "Password"}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t("password_placeholder") || "••••••••"}
              required
            />
          </div>

          {/* Date of Birth and Start Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                {t("date_of_birth") || "Date of Birth"}
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">
                {t("start_date") || "Start Date"}
              </Label>
              <Input
                id="startDate"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Group ID */}
          <div className="space-y-2">
            <Label htmlFor="groupId">
              {t("group_id_optional") || "Group ID (Optional)"}
            </Label>
            <Input
              id="groupId"
              name="groupId"
              value={form.groupId}
              onChange={handleChange}
              placeholder={t("group_id_placeholder") || "Enter group ID"}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loading") || "Adding..."}
              </>
            ) : (
              t("add_button") || "Add Student"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
