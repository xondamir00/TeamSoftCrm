"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/Service/api";
import { ChevronRight, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  parentPhone?: string;
  payment?: number;
}

const Pupils = () => {
  const {t}= useTranslation()
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/students");
      setStudents(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Ma'lumotlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="w-[98%] mx-auto bg-black text-white border border-gray-700 rounded-xl p-3 shadow-md">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="text-lg text-gray-300">
           {t("pupils")}
          </TableCaption>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">T/r</TableHead>
              <TableHead className="text-gray-300">{t("Sname")}</TableHead>
              <TableHead className="text-gray-300">{t("phone")}</TableHead>
              <TableHead className="text-gray-300">{t("phone2")}</TableHead>
              <TableHead className="text-gray-300 text-right">{t("price")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : err ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Alert variant="destructive">
                    <AlertDescription>{err}</AlertDescription>
                  </Alert>
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-4"
                >
                  Hozircha talabalar yo‘q
                </TableCell>
              </TableRow>
            ) : (
              students.map((s, index) => (
                <TableRow
                  key={s.id}
                  className="border-gray-700 hover:bg-gray-900 transition"
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{`${s.firstName} ${s.lastName}`}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>{s.parentPhone || "—"}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    <span>{s.payment ? `${s.payment} so‘m` : "—"}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Pupils;
