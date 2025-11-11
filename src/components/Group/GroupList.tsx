"use client";
import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import AddGroupForm from "./AddGoup";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Group {
  id: string;
  name: string;
  roomId?: string;
  capacity?: number;
  daysPattern?: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
}

export default function GroupList() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/groups", {
        params: { isActive: true }, // faqat faol guruhlarni olish
      });
      setGroups(data?.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  // Xonalarni olish
  const fetchRooms = async () => {
    try {
      const { data } = await api.get("/rooms");
      setRooms(data?.items || []);
    } catch (err) {
      console.error("Xonalarni olishda xato:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setLoading(true);
      console.log("Deleting group id:", deleteTarget.id);

      const res = await api.delete(`/groups/${deleteTarget.id}`);
      setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));

      if (res.status === 200 || res.status === 204) {
        setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        console.warn("Unexpected response:", res);
        alert("Serverdan kutilmagan javob keldi");
      }
    } catch (err: any) {
      console.error("Delete error:", err?.response || err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "O‘chirishda xatolik yuz berdi yoki guruh topilmadi";

      alert(message);
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchRooms();
  }, []);

  const formatTime = (time?: string) => {
    if (!time) return "-";
    try {
      const date = new Date(`1970-01-01T${time}`);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time;
    }
  };

  // roomId orqali xona nomini topish
  const getRoomName = (roomId?: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? room.name : "-";
  };

  return (
    <div className="w-[98%] mx-auto bg-white dark:bg-black dark:text-white border dark:border-gray-700 rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("groups_list")}</h2>

        {/* Guruh qo‘shish tugmasi */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
              onClick={() => {
                setEditingGroup(null);
                setSheetOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> {t("add_group")}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full sm:max-w-md p-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto"
          >
            <SheetHeader className="p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <SheetTitle>
                {editingGroup ? t("edit_group") : t("add_group")}
              </SheetTitle>
              <SheetDescription>
                {editingGroup
                  ? t("edit_group_description")
                  : t("add_group_description")}
              </SheetDescription>
            </SheetHeader>

            <div className="p-4 flex-1">
              <AddGroupForm
                editingGroup={editingGroup}
                onSuccess={() => {
                  setSheetOpen(false);
                  fetchGroups();
                }}
                onCancel={() => setSheetOpen(false)}
              />
            </div>

            <div className="flex justify-end p-3 border-t dark:border-gray-700">
              <SheetClose asChild>
                <Button variant="outline">{t("close")}</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500 text-center">{t("no_groups")}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left p-2">{t("name")}</th>
              <th className="text-left p-2">{t("room")}</th>
              <th className="text-left p-2">{t("capacity")}</th>
              <th className="text-left p-2">Days</th>
              <th className="text-left p-2">{t("time")}</th>
              <th className="text-right p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr
                key={g.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-2">{g.name}</td>
                <td className="p-2">{getRoomName(g.roomId)}</td>
                <td className="p-2">{g.capacity ?? "-"}</td>
                <td className="p-2">{g.daysPattern || "-"}</td>
                <td className="p-2">
                  {`${formatTime(g.startTime)} - ${formatTime(g.endTime)}`}
                </td>

                <td className="p-2 text-right flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingGroup(g);
                      setSheetOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <AlertDialog open={deleteTarget?.id === g.id}>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTarget(g)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("delete_confirm_title") ||
                            "O‘chirishni tasdiqlang"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("delete_confirm_text") ||
                            `"${g.name}" guruhini o‘chirishni xohlaysizmi? Bu amalni ortga qaytarib bo‘lmaydi.`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setDeleteTarget(null)}
                        >
                          {t("cancel") || "Bekor qilish"}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={handleDelete}
                        >
                          {t("delete") || "O‘chirish"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
