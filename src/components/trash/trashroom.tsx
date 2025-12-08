"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Room } from "@/Store/Room/RoomInterface";
import { trashRoomService } from "@/Service/TrashService";

export default function TrashRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { t } = useTranslation();

  const loadRooms = async () => {
    const data = await trashRoomService.getAll();
    setRooms(data.items ?? []);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const restoreRoom = async (id: string) => {
    await trashRoomService.restore(id);
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg p-5 bg-white dark:bg-slate-900 backdrop-blur border border-red-200 dark:border-red-900/40 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-600 dark:text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            {t("trashTitle") || "Trash"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {rooms.length === 0 && (
            <p className="text-center text-sm opacity-60 py-4 dark:text-gray-300">
              {t("emptyText")}
            </p>
          )}

          <AnimatePresence>
            {rooms.map((r: Room) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 40 }}
                transition={{ duration: 0.25 }}
                className="flex justify-between items-center p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 dark:border-red-900/40 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              >
                <div>
                  <p className="font-medium line-through text-red-700 dark:text-red-400">
                    {r.name}
                  </p>
                  <p className="text-xs opacity-60 dark:text-gray-300">
                    {t("capacity")}: {r.capacity ?? "—"}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 border-red-400 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40"
                  onClick={() => restoreRoom(r.id)}
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("restore") || "Restore"}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
