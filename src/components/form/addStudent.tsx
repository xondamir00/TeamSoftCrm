"use client";

import React, { useState } from "react";
import { api } from "@/Service/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

interface ApiError {
  message?: string;
}

export default function CreateStudentForm() {
  const { t } = useTranslation();

  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [startDate, setStartDate] = useState("");
  const [groupId, setGroupId] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);

    try {
      const { data } = await api.post("/students", {
        firstName,
        lastName,
        phone,
        password,
        dateOfBirth: dateOfBirth || undefined,
        startDate: startDate || undefined,
        groupId: groupId || undefined,
      });

      setMsg(`${t("student_created")}: ${data.firstName} ${data.lastName}`);

      setFirst("");
      setLast("");
      setPhone("");
      setPassword("");
      setDob("");
      setStartDate("");
      setGroupId("");
    } catch (error) {
      const errObj = error as AxiosError<ApiError>;
      setErr(errObj.response?.data?.message || t("create_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-6">
      <Card className="w-full max-w-lg bg-white dark:bg-black shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">
            {t("add_student")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>{t("first_name")}</Label>
                <Input
                  placeholder={t("first_name")}
                  value={firstName}
                  onChange={(e) => setFirst(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>{t("last_name")}</Label>
                <Input
                  placeholder={t("last_name")}
                  value={lastName}
                  onChange={(e) => setLast(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label>{t("phone_number")}</Label>
              <Input
                placeholder="+998901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>{t("password")}</Label>
              <Input
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>{t("date_of_birth")}</Label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div>
                <Label>{t("start_date")}</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>{t("group_id_optional")}</Label>
              <Input
                placeholder={t("enter_group_id")}
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center bg-[#3F8CFF] text-white hover:bg-blue-600 justify-center"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("add")}
            </Button>

            {msg && (
              <Alert className="bg-green-50 border-green-300">
                <AlertDescription>{msg}</AlertDescription>
              </Alert>
            )}

            {err && (
              <Alert variant="destructive">
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
