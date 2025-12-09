"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { api } from "@/Service/ApiService/api";
import type { StudentForm } from "@/Store/Student/StudentInterface";

interface EditStudentProps {
  studentId: number;
  onUpdated?: () => void;
}

export default function EditStudent({
  studentId,
  onUpdated,
}: EditStudentProps) {
  const { t } = useTranslation();

  const [form, setForm] = useState<StudentForm>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    startDate: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${studentId}`);
        const student = res.data;

        setForm({
          firstName:
            student.user?.firstName || student.fullName?.split(" ")[0] || "",
          lastName:
            student.user?.lastName || student.fullName?.split(" ")[1] || "",
          phone: student.user?.phone || student.phone || "",
          password: "",
          dateOfBirth: student.dateOfBirth?.split("T")[0] || "",
          startDate: student.startDate?.split("T")[0] || "",
          isActive: student.user?.isActive ?? student.isActive ?? true,
        });
      } catch (error) {
        console.error(error);
        setAlert({ type: "error", message: t("fetch_error") });
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchStudent();
  }, [studentId, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/students/${studentId}`, form);
      setAlert({ type: "success", message: t("update_success") });
      onUpdated?.();
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", message: t("update_error") });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-400 dark:text-gray-500">
        {t("loading_student")}
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-900 dark:text-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            {t("edit_student")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alert.message && (
            <Alert
              className={`mb-4 ${
                alert.type === "success"
                  ? "border-green-500 text-green-700 dark:border-green-400 dark:text-green-300"
                  : "border-red-500 text-red-700 dark:border-red-400 dark:text-red-300"
              }`}
            >
              {alert.type === "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <AlertTitle>
                {alert.type === "success" ? t("success") : t("error")}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{t("first_name")}</Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>{t("last_name")}</Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>{t("phone")}</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>{t("password")}</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={t("password_optional")}
              />
            </div>
            <div>
              <Label>{t("dob")}</Label>
              <Input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>{t("start_date")}</Label>
              <Input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              <Label>{t("active")}</Label>
            </div>
            <Button type="submit" className="w-full">
              {t("update_student")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
