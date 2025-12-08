"use client";

import React, { useState } from "react";
import { api } from "@/Service/ApiService/api";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface ManagerPayload {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  photoUrl?: string | null;
  monthlySalary?: number;
}

interface ApiErrorResponse {
  message?: string;
}

export default function AddManagerForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    photoUrl: "",
    monthlySalary: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const payload: ManagerPayload = {
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

      await api.post("/managers", payload);

      setMessage("success");
      setIsDialogOpen(true);
      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        photoUrl: "",
        monthlySalary: "",
      });
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      setMessage(err.response?.data?.message || "Error occurred");
      setIsDialogOpen(true);
      const errMsg = err.response?.data?.message || t("manager_add_error");
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <Card className="p-5 shadow-xl rounded-2xl bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {t("add_manager")}
            </CardTitle>
          </CardHeader>

          <CardContent>
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
                  required
                />
              </div>

              <div>
                <Label>{t("photo_url_optional")}</Label>
                <Input
                  name="photoUrl"
                  value={form.photoUrl}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>{t("monthly_salary_optional")}</Label>
                <Input
                  type="number"
                  name="monthlySalary"
                  value={form.monthlySalary}
                  onChange={handleChange}
                />
              </div>

              <Button
                disabled={loading}
                type="submit"
                className="w-full text-lg rounded-xl bg-[#0208B0] hover:bg-[#0208B0] text-white  shadow-lg transition-all duration-200"
              >
                {loading ? t("loading") : t("add_button")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {message === "success"
                ? t("manager_added_success")
                : t("manager_add_error")}
            </DialogTitle>
          </DialogHeader>

          <Alert variant={message === "success" ? "default" : "destructive"}>
            <AlertTitle>
              {message === "success" ? t("success") : t("error")}
            </AlertTitle>
            <AlertDescription>
              {message === "success" ? t("manager_added_success") : message}
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    </div>
  );
}
