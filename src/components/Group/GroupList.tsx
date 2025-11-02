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
import type { Group } from "@/Store";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import AddGroupForm from "./AddGoup";

const Groups = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Drawer holati

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/groups");
      setGroups(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Ma'lumotlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Drawer ochilganda scrollni bloklaymiz
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
        <h2 className="text-2xl font-semibold text-[#3F8CFF]">{t("groups")}</h2>

        {/* Drawer Trigger */}
        <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-[#3F8CFF] hover:bg-[#3578e5] text-white flex items-center gap-2 rounded-xl px-4 py-2"
            >
              <Plus className="w-5 h-5" /> Yangi guruh qo‘shish
            </Button>
          </DrawerTrigger>

          {/* Drawer ichidagi form */}
          <DrawerContent className="!max-w-[460px] ml-auto h-full flex flex-col justify-between bg-white dark:bg-[#0d1117] shadow-xl rounded-none">
            <div className="p-6 flex justify-center overflow-y-auto">
              <div className="w-full max-w-[400px]">
                <AddGroupForm
                  onSuccess={() => {
                    fetchGroups();
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>

            <div className="flex justify-center pb-5">
              <DrawerClose asChild>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-[#3F8CFF] hover:bg-[#3578e5] text-white rounded-xl"
                >
                  Yopish
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="text-lg dark:text-gray-300">
            {t("groups")}
          </TableCaption>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-300">T/r</TableHead>
              <TableHead className="dark:text-gray-300">Guruh nomi</TableHead>
              <TableHead className="dark:text-gray-300">Xona</TableHead>
              <TableHead className="dark:text-gray-300">O‘qituvchi</TableHead>
              <TableHead className="dark:text-gray-300 text-right">
                Sana
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
                  Hozircha guruhlar yo‘q
                </TableCell>
              </TableRow>
            ) : (
              groups.map((g, index) => (
                <TableRow
                  key={g.id}
                  className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#111827] transition"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{g.name}</TableCell>
                  <TableCell>{g.room?.name || "—"}</TableCell>
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
