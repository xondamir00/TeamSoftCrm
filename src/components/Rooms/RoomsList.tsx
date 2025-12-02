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

import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AxiosError } from "axios";

import { RoomService, type Room } from "@/Store/room";

const RoomsList = () => {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await RoomService.getAll();
      setRooms(data);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setErr(err.response?.data?.message || t("fetch_error"));
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
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );

  if (err)
    return (
      <Alert variant="destructive">
        <AlertDescription>{err}</AlertDescription>
      </Alert>
    );

  if (!rooms.length) return <p className="text-center py-5">{t("no_rooms")}</p>;

  return (
    <div className="w-[98%] mx-auto border rounded-xl p-4 shadow">
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
              <TableRow key={r.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.capacity ?? "—"}</TableCell>
                <TableCell>
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : "—"}
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
