import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { RoomService, type Room } from "@/Store/room";

export default function RoomsPage() {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  const [editRoom, setEditRoom] = useState<Room | null>(null);

  const loadRooms = async () => {
    try {
      const data = await RoomService.getAll();
      setRooms(data.filter((x) => x.isActive !== false));
    } catch (err) {
      console.error("Xonalar yuklanmadi:", err);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const createRoom = async (e: React.FormEvent) => {
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
      console.error("Xona qo‘shilmadi:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async () => {
    if (!editRoom) return;

    try {
      await RoomService.update(editRoom.id, {
        name: editRoom.name,
        capacity:
          editRoom.capacity === undefined
            ? undefined
            : Number(editRoom.capacity),
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
      console.error("Xona o‘chirilmadi:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-sm border dark:border-neutral-800 dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="dark:text-white">{t("add_room")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={createRoom}
            className="flex gap-4 flex-wrap items-end"
          >
            <div className="flex-1 min-w-[200px]">
              <Label className="dark:text-neutral-300">{t("room_name")}</Label>
              <Input
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <div className="min-w-[120px]">
              <Label className="dark:text-neutral-300">{t("capacity")}</Label>
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <Button disabled={loading} className="flex gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
              {t("add")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-sm border dark:border-neutral-800 dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="dark:text-white">{t("rooms_list")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <AnimatePresence>
            {rooms.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.4,
                  rotate: Math.random() * 40 - 20,
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  filter: "blur(4px)",
                }}
                transition={{ duration: 0.45 }}
                className="flex justify-between items-center p-3 border rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-md transition"
              >
                <div>
                  <p className="font-medium dark:text-white">{r.name}</p>
                  <p className="text-sm opacity-60 dark:text-neutral-400">
                    {t("capacity")}: {r.capacity ?? "—"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="dark:border-neutral-600"
                    onClick={() => setEditRoom({ ...r })}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteRoom(r.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {editRoom && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-sm space-y-4 shadow-lg"
          >
            <h2 className="text-lg font-semibold dark:text-white">
              {t("edit_room")}
            </h2>

            <div>
              <Label className="dark:text-neutral-300">{t("room_name")}</Label>
              <Input
                value={editRoom.name}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, name: e.target.value })
                }
                className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <div>
              <Label className="dark:text-neutral-300">{t("capacity")}</Label>
              <Input
                type="number"
                value={editRoom.capacity ?? ""}
                onChange={(e) =>
                  setEditRoom({
                    ...editRoom,
                    capacity:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditRoom(null)}
                className="dark:border-neutral-600"
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
