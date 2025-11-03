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
import { ChevronRight, Loader2, PlusCircle } from "lucide-react";
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
  const [openDrawer, setOpenDrawer] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/students");
      setStudents(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="w-[98%] mx-auto dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-3 shadow-md">
      {/* Header and Drawer Trigger */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">{t("pupils")}</h2>

        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              <PlusCircle className="w-4 h-4" />
              {t("add_student")}
            </Button>
          </DrawerTrigger>

          {/* ✅ Drawer Content (Right side) */}
          <DrawerContent
            className="fixed right-0 top-0 h-full w-[400px] max-w-full shadow-lg border-l 
            dark:border-gray-700 bg-white dark:bg-black dark:text-white rounded-none"
            side="right"
          >
            <DrawerHeader>
              <DrawerTitle>{t("add_student")}</DrawerTitle>
            </DrawerHeader>

            <div className="p-4 overflow-y-auto h-[calc(100%-100px)]">
              <CreateStudentForm />
            </div>

            <div className="flex justify-center pb-4">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  {t("close")}
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="text-lg dark:text-gray-300">
            {t("pupils")}
          </TableCaption>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-300">{t("tr")}</TableHead>
              <TableHead className="dark:text-gray-300">
                {t("full_name")}
              </TableHead>
              <TableHead className="dark:text-gray-300">{t("phone")}</TableHead>
              <TableHead className="dark:text-gray-300">
                {t("parent_phone")}
              </TableHead>
              <TableHead className="dark:text-gray-300 text-right">
                {t("payment")}
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
                  {t("no_students")}
                </TableCell>
              </TableRow>
            ) : (
              students.map((s, index) => (
                <TableRow
                  key={s.id}
                  className="border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
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
