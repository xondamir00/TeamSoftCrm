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
import type { Group } from "@/Store";

const Groups = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/groups");
      setGroups(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="w-[98%] mx-auto dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-3 shadow-md">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="text-lg dark:text-gray-300">
            {t("groups")}
          </TableCaption>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-300">{t("tr")}</TableHead>
              <TableHead className="dark:text-gray-300">
                {t("group_name")}
              </TableHead>
              <TableHead className="dark:text-gray-300">{t("room")}</TableHead>
              <TableHead className="dark:text-gray-300">
                {t("teacher")}
              </TableHead>
              <TableHead className="dark:text-gray-300 text-right">
                {t("date")}
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
            ) : groups.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-4"
                >
                  {t("no_groups")}
                </TableCell>
              </TableRow>
            ) : (
              groups.map((g, index) => (
                <TableRow
                  key={g.id}
                  className="border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{g.name}</TableCell>
                  <TableCell>{g.teacherId || "—"}</TableCell>
                  <TableCell className="text-right flex justify-end items-center gap-2">
                    <span>
                      {g.createdAt
                        ? new Date(g.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
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

export default Groups;
