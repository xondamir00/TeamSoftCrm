import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Student {
  id: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  dateOfBirth?: string;
  startDate?: string;
  createdAt?: string;
}

export default function TrashStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/students", {
        params: { isActive: false },
      });
      setStudents(data.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const restore = async (id: string) => {
    await api.patch(`/students/${id}/restore`);
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg border-red-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Korzina / O‘chirilgan talabalar
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {loading && (
            <p className="text-center text-sm opacity-60 py-4">
              Yuklanmoqda...
            </p>
          )}

          {!loading && students.length === 0 && (
            <p className="text-center text-sm opacity-60 py-4">
              Korzina hozircha bo‘sh ✅
            </p>
          )}

          <AnimatePresence>
            {students.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 40 }}
                transition={{ duration: 0.25 }}
                className="flex justify-between items-center p-3 rounded-lg border bg-red-50 shadow-sm hover:bg-red-100 transition"
              >
                <div>
                  <p className="font-medium line-through text-red-700">
                    {s.fullName}
                  </p>
                  <p className="text-xs opacity-60">
                    Telefon: {s.phone || "—"}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 border-red-400 text-red-600 hover:bg-red-200"
                  onClick={() => restore(s.id)}
                >
                  <RotateCcw className="h-4 w-4" />
                  Qaytarish
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
