"use client";

import { useState, useEffect } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";

interface Student { id: string; fullName: string; phone?: string; }
interface Group { id: string; name: string; }
interface Props { onClose?: () => void; onSuccess?: () => void; }

export default function CreateEnrollmentDrawer({ onClose, onSuccess }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [studentId, setStudentId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [joinDate, setJoinDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStudents, resGroups] = await Promise.all([api.get("/students"), api.get("/groups")]);
        setStudents(resStudents.data.items ?? []);
        setGroups(resGroups.data.items ?? []);
      } catch (err) { setError("Ma'lumotlarni yuklashda xatolik yuz berdi"); }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !groupId) { setError("Iltimos, student va guruhni tanlang"); return; }
    setLoading(true);
    try {
      await api.post("/enrollments", { studentId, groupId, joinDate: joinDate || undefined });
      onSuccess?.();
    } catch (err: any) { setError(err.response?.data?.message || "Serverda xatolik"); }
    finally { setLoading(false); }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white w-full max-w-md p-6 shadow-xl relative"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Yangi Enrollment yaratish</h2>

        {error && (
          <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xatolik yuz berdi</AlertDialogTitle>
                <AlertDialogDescription>{error}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setError(null)}>Yopish</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">Student</Label>
            <select id="student" className="border rounded w-full p-2 mt-1" value={studentId} onChange={e => setStudentId(e.target.value)}>
              <option value="">Tanlang</option>
              {(students ?? []).map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
          </div>

          <div>
            <Label htmlFor="group">Guruh</Label>
            <select id="group" className="border rounded w-full p-2 mt-1" value={groupId} onChange={e => setGroupId(e.target.value)}>
              <option value="">Tanlang</option>
              {(groups ?? []).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div>
            <Label htmlFor="joinDate">Join Date</Label>
            <Input id="joinDate" type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
            <Button type="submit" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" /> : null} Yaratish</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
