import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Edit, Trash, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [trashRooms, setTrashRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [editRoom, setEditRoom] = useState(null);

  const loadRooms = async () => {
    const { data } = await api.get("/rooms");
    setRooms(data.filter((r) => r.isActive !== false));
    setTrashRooms(data.filter((r) => r.isActive === false));
  };

  useEffect(() => { loadRooms(); }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post("/rooms", { name, capacity: capacity ? Number(capacity) : undefined });
    setName(""); setCapacity(""); setLoading(false);
    loadRooms();
  };

  const updateRoom = async () => {
    await api.patch(`/rooms/${editRoom.id}`, {
      name: editRoom.name,
      capacity: Number(editRoom.capacity),
    });
    setEditRoom(null);
    loadRooms();
  };

  const deleteRoom = async (id) => {
    await api.patch(`/rooms/${id}`, { isActive: false });
    loadRooms();
  };

  const restoreRoom = async (id) => {
    await api.patch(`/rooms/${id}`, { isActive: true });
    loadRooms();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* ADD FORM */}
      <Card className="shadow-lg">
        <CardHeader><CardTitle className="text-lg font-semibold">Xona qo‘shish</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={createRoom} className="space-y-4">
            <div><Label>Xona nomi</Label><Input value={name} required onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Sig‘imi (ixtiyoriy)</Label><Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} /></div>
            <Button className="w-full flex gap-2 justify-center" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Qo‘shish
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ACTIVE ROOMS */}
        <Card className="shadow-lg p-4">
          <CardTitle className="mb-4">Xonalar</CardTitle>
          <AnimatePresence>
            {rooms.map((r) => (
              <motion.div
                layoutId={`room-${r.id}`}
                key={r.id}
                className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-sm opacity-60">Sig‘imi: {r.capacity ?? "—"}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditRoom({ ...r })}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteRoom(r.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </Card>

        {/* TRASH */}
        <Card className="shadow-lg p-4 border-red-300">
          <CardTitle className="mb-4 text-red-600 flex items-center gap-2">
            <Trash className="h-5 w-5" /> Trash
          </CardTitle>

          <AnimatePresence>
            {trashRooms.map((r) => (
              <motion.div
                layoutId={`room-${r.id}`}
                key={r.id}
                className="flex justify-between items-center p-3 border rounded-lg bg-red-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <div>
                  <p className="font-medium line-through">{r.name}</p>
                  <p className="text-sm opacity-60">Sig‘imi: {r.capacity ?? "—"}</p>
                </div>

                <Button size="sm" onClick={() => restoreRoom(r.id)}>
                  <RotateCcw className="h-4 w-4" /> Qaytarish
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </Card>

      </div>

      {/* EDIT MODAL */}
      {editRoom && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">Xonani tahrirlash</h2>

            <div>
              <Label>Xona nomi</Label>
              <Input value={editRoom.name} onChange={(e) => setEditRoom({ ...editRoom, name: e.target.value })} />
            </div>

            <div>
              <Label>Sig‘imi</Label>
              <Input type="number" value={editRoom.capacity} onChange={(e) => setEditRoom({ ...editRoom, capacity: e.target.value })} />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditRoom(null)}>Bekor</Button>
              <Button onClick={updateRoom}>Saqlash</Button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
