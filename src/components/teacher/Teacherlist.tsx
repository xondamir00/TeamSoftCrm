"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
}

export default function TeacherList() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/teachers");
      setTeachers(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="w-[98%] mx-auto bg-white dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-4 shadow-md">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="text-lg dark:text-gray-300">
            {t("teachers_list")}
          </TableCaption>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-300">{t("tr")}</TableHead>
              <TableHead className="dark:text-gray-300">{t("full_name")}</TableHead>
              <TableHead className="dark:text-gray-300">{t("phone")}</TableHead>
              <TableHead className="dark:text-gray-300 text-right">{t("date_added")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                  {t("no_teachers")}
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((tchr, index) => (
                <TableRow
                  key={tchr.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{`${tchr.firstName} ${tchr.lastName}`}</TableCell>
                  <TableCell>{tchr.phone}</TableCell>
                  <TableCell className="text-right">
                    {new Date(tchr.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
