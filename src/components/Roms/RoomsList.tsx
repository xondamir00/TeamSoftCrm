"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/Service/api";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Room {
  id: string;
  name: string;
  capacity?: number;
  createdAt: string;
}

const RoomsList = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/rooms");
      setRooms(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );

  if (err)
    return (
      <Alert variant="destructive">
        <AlertDescription>{err}</AlertDescription>
      </Alert>
    );

  if (!rooms.length)
    return (
      <p className="text-center text-gray-500 py-5">{t("no_rooms")}</p>
    );

  return (
    <div className="w-[98%] mx-auto dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-4 shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tr")}</TableHead>
              <TableHead>{t("room_name")}</TableHead>
              <TableHead>{t("capacity")}</TableHead>
              <TableHead>{t("created_at")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((r, i) => (
              <TableRow
                key={r.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.capacity ?? "—"}</TableCell>
                <TableCell>
                  {new Date(r.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RoomsList;
