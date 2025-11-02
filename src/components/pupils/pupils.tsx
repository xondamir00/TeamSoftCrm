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
import { ChevronRight, Loader2, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import type { Student } from "@/Store";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import CreateStudentForm from "../form/addStudent";

const Pupils = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // 👈 Drawer holatini boshqarish

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

  // ✅ Scrollni to‘liq bloklaymiz
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  return (
    <div
      className="
        w-[98%] mx-auto
        bg-white text-black
        dark:bg-[#0d1117] dark:text-white
        border dark:border-gray-800
        rounded-2xl p-6 shadow-md
        transition-colors duration-500
      "
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-[#3F8CFF]">{t("pupils")}</h2>

        {/* Drawer Trigger */}
        <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-[#3F8CFF] hover:bg-[#3578e5] text-white flex items-center gap-2 rounded-xl px-4 py-2"
            >
              <Plus className="w-5 h-5" /> {t("add_student")}
            </Button>
          </DrawerTrigger>

          <DrawerContent
            className="
              fixed right-0 top-0 bottom-0
              sm:max-w-[600px] w-full
              rounded-l-2xl shadow-2xl
              border-l border-gray-700
              bg-white dark:bg-[#0d1117]
              text-black dark:text-white
              transition-all duration-500
            "
          >
            <DrawerHeader>
              <DrawerTitle className="text-[#3F8CFF] text-2xl font-semibold text-center">
                {t("add_student")}
              </DrawerTitle>
            </DrawerHeader>

            <div className="p-6">
              <CreateStudentForm />
            </div>

            <div className="flex justify-center pb-5">
              <DrawerClose asChild>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-[#3F8CFF] hover:bg-[#3578e5] text-white rounded-xl"
                >
                  {t("close")}
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="text-lg dark:text-gray-400">
            {t("pupils")}
          </TableCaption>
          <TableHeader>
            <TableRow className="dark:border-gray-800 border-gray-200">
              <TableHead className="dark:text-gray-300 text-gray-700">
                T/r
              </TableHead>
              <TableHead className="dark:text-gray-300 text-gray-700">
                {t("Sname")}
              </TableHead>
              <TableHead className="dark:text-gray-300 text-gray-700">
                {t("phone")}
              </TableHead>
              <TableHead className="dark:text-gray-300 text-gray-700">
                {t("phone2")}
              </TableHead>
              <TableHead className="dark:text-gray-300 text-gray-700 text-right">
                {t("price")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto dark:text-gray-400" />
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
                  className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#111827] transition"
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
