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
    } catch (e: any) {
      setErr(e?.response?.data?.message || t("create_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border border-gray-700   shadow-xl rounded-2xl p-6">
      <CardHeader>
        <CardTitle className="text-center text-2xl  font-semibold">
          {t("add_student")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Ism */}
          <div>
            <Label className="text-xl">{t("first_name")}</Label>
            <Input
              className="h-10 text-lg px-5 rounded-xl text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              placeholder={t("first_name")}
              value={firstName}
              onChange={(e) => setFirst(e.target.value)}
              required
            />
          </div>

          {/* Familiya */}
          <div>
            <Label className="text-xl">{t("last_name")}</Label>
            <Input
              className="h-10 text-lg px-5 rounded-xl text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              placeholder={t("last_name")}
              value={lastName}
              onChange={(e) => setLast(e.target.value)}
              required
            />
          </div>

          {/* Telefon */}
          <div>
            <Label className="text-xl">{t("phone_number")}</Label>
            <Input
              className="h-10 text-lg px-5 rounded-xl text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              placeholder="+998901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Parol */}
          <div>
            <Label className="text-xl">{t("password")}</Label>
            <Input
              type="password"
              className="h-10 text-lg px-5 rounded-xl text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Tug‘ilgan sana */}
          <div>
            <Label className="text-xl">{t("date_of_birth")}</Label>
            <Input
              type="date"
              className="h-10 text-lg px-5 rounded-xl text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              value={dateOfBirth}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* Boshlanish sanasi */}
          <div>
            <Label className="text-xl">{t("start_date")}</Label>
            <Input
              type="date"
              className="h-10 text-lg px-5 rounded-xl text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Guruh ID */}
          <div>
            <Label className="text-xl">{t("group_id_optional")}</Label>
            <Input
              className="h-10 text-lg px-5 rounded-xl text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              placeholder={t("enter_group_id")}
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />
          </div>

          {/* Tugma */}
          <Button
            type="submit"
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md transition"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
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
  );
}
