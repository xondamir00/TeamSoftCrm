"use client";

import { useEffect, useState, type FormEvent } from "react";
import { RoomService } from "@/Service/RoomService";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Room } from "@/Store/Room/RoomInterface";

export default function RoomsPage() {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await RoomService.getAll();
      setRooms(data.filter((x) => x.isActive !== false));
    } catch (err) {
      console.error("Xonalar yuklanmadi:", err);
    }
  };

  const createRoom = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await RoomService.create({
        name,
        capacity: capacity ? Number(capacity) : undefined,
      });

      setName("");
      setCapacity("");
      loadRooms();
    } catch (err) {
      console.error("Xona qo'shilmadi:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async () => {
    if (!editRoom) return;

    try {
      await RoomService.update(editRoom.id, {
        name: editRoom.name,
        capacity: editRoom.capacity
          ? Number(editRoom.capacity)
          : undefined,
      });

      setEditRoom(null);
      loadRooms();
    } catch (err) {
      console.error("Xona yangilanmadi:", err);
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      await RoomService.delete(id);
      setRooms((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Xona o'chirilmadi:", err);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.85, y: -20 },
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      <motion.div
        className="bg-white/70 dark:bg-slate-900 backdrop-blur-md p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {t("add_room")}
        </h2>

        <form
          onSubmit={createRoom}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div>
            <Label className="text-gray-900 dark:text-white">
              {t("room_name")}
            </Label>
            <Input
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder={t("room_name")}
              className="mt-1 dark:bg-slate-900 dark:border-neutral-700 dark:text-white"
            />
          </div>

          <div>
            <Label className="text-gray-900 dark:text-white">
              {t("capacity")}
            </Label>
            <Input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder={t("capacity")}
              className="mt-1 dark:bg-slate-900 dark:border-neutral-700 dark:text-white"
            />
          </div>

          <div className="flex justify-start md:justify-end">
            <Button
              type="submit"
              className="bg-[#0208B0] hover:bg-[#0208B0] text-white font-semibold rounded-xl shadow-lg transition flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("add")}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* ROOM LIST */}
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {rooms.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center text-gray-500 dark:text-neutral-400 py-4"
            >
              {t("no_rooms")}
            </motion.p>
          )}

          {rooms.map((r) => (
            <motion.div
              key={r.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white/70 dark:bg-slate-900 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg md:text-xl font-bold dark:text-white">
                  {r.name}
                </h3>
                <p className="text-sm opacity-70 dark:text-neutral-400 mt-1">
                  {t("capacity")}: {r.capacity ?? "—"}
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="dark:border-neutral-600 hover:bg-gray-200/20 dark:hover:bg-gray-700/20 transition"
                  onClick={() => setEditRoom({ ...r })}
                >
                  <Edit className="h-5 w-5" />
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteRoom(r.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* EDIT MODAL */}
      {editRoom && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-md space-y-5 shadow-2xl"
          >
            <h2 className="text-xl md:text-2xl font-semibold dark:text-white">
              {t("edit_room")}
            </h2>

            <div>
              <Label className="dark:text-neutral-300">{t("room_name")}</Label>
              <Input
                value={editRoom.name}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, name: e.target.value })
                }
                className="mt-1 dark:bg-slate-900 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <div>
              <Label className="dark:text-neutral-300">{t("capacity")}</Label>
              <Input
                type="number"
                value={editRoom.capacity || ""}
                onChange={(e) =>
                  setEditRoom({
                    ...editRoom,
                    capacity: e.target.value,
                  })
                }
                className="mt-1 dark:bg-slate-900 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                className="dark:border-neutral-600"
                onClick={() => setEditRoom(null)}
              >
                {t("cancel")}
              </Button>

              <Button onClick={updateRoom}>{t("save")}</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
