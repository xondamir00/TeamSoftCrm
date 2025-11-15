"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";

interface Enrollment {
  id: string;
  status: string;
  joinDate: string;
  student: {
    id: string;
    fullName: string;
    phone: string;
  };
  group: {
    id: string;
    name: string;
  } | null;
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Load all groups
  const loadGroups = async () => {
    try {
      const { data } = await api.get("/groups");
      setGroups(data.items);
    } catch (err) {
      console.error("Groups load error:", err);
    }
  };

  // 🔹 Load enrollments
  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/enrollments", {
        params: {
          search: search || undefined,
          groupId: selectedGroup || undefined,
          page,
          limit: 10,
        },
      });

      setEnrollments(
        data.items.map((e: any) => ({
          ...e,
          student: {
            id: e.student.id,
            fullName: `${e.student.user.firstName} ${e.student.user.lastName}`,
            phone: e.student.user.phone,
          },
        }))
      );
      console.log(data.items);
    } catch (err) {
      console.error("Enrollmentlarni olishda xato:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Effects
  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadEnrollments(), 300); // debounce 300ms
    return () => clearTimeout(timer);
  }, [search, selectedGroup, page]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="shadow-md border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700">
            Talabalar Ro‘yxati
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input
              placeholder="Qidirish (ism, telefon...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/2"
            />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="border rounded-md p-2 text-sm w-full sm:w-1/3"
            >
              <option value="">Barcha guruhlar</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
            </div>
          ) : enrollments.length === 0 ? (
            <p className="text-center text-sm py-6 opacity-60">
              Ma’lumot topilmadi ❌
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Ism Familiya</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Guruh</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Qo‘shilgan sana</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {enrollments.map((e, i) => (
                      <motion.tr
                        key={e.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="border-b hover:bg-blue-50"
                      >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{e.student.fullName}</TableCell>
                        <TableCell>{e.student.phone}</TableCell>
                        <TableCell>{e.group?.name ?? "—"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              e.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {e.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(e.joinDate).toLocaleDateString()}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
