import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function TrashRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const { t } = useTranslation();

  const load = async () => {
    const { data } = await api.get("/rooms");
    setRooms(data.filter((r) => r.isActive === false));
  };

  useEffect(() => {
    load();
  }, []);

  const restore = async (id) => {
    await api.patch(`/rooms/${id}`, { isActive: true });
    setRooms((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg border-red-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            {t("trashTitle")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          {rooms.length === 0 && (
            <p className="text-center text-sm opacity-60 py-4">
              {t("emptyText")}
            </p>
          )}

          <AnimatePresence>
            {rooms.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 40 }}
                transition={{ duration: 0.25 }}
                className="flex justify-between items-center p-3 rounded-lg border bg-red-50 shadow-sm hover:bg-red-100 transition"
              >
                <div>
                  <p className="font-medium line-through text-red-700">{r.name}</p>
                  <p className="text-xs opacity-60">
                    {t("capacity")}: {r.capacity ?? "—"}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 border-red-400 text-red-600 hover:bg-red-200"
                  onClick={() => restore(r.id)}
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("restore")}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

        </CardContent>
      </Card>
    </div>
  );
}
