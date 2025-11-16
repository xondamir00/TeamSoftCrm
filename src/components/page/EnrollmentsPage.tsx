"use client";

import { useState, useEffect } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import { Loader2, Trash, Plus, Edit } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import CreateEnrollmentDrawer from "../Enrollments/CreateEnrollmentModal";
import EditEnrollmentDrawer from "../Enrollments/EditEnrollmentDrawer";

interface Enrollment {
  id: string;
  status: "ACTIVE" | "PAUSED" | "LEFT";
  joinDate: string;
  leaveDate?: string;
  student: {
    id: string;
    fullName: string;
    phone?: string;
  };
  group: {
    id: string;
    name: string;
  };
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editEnrollment, setEditEnrollment] = useState<Enrollment | null>(null);
  const [] = useState<Enrollment | null>(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/enrollments");
      setEnrollments(res.data.student ?? []);
    } catch (err) {
      console.error(err);
      setError("Enrollmentsni olishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnrollments(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/enrollments/${id}`);
      fetchEnrollments();
    } catch (err) {
      console.error(err);
      setError("O‘chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Enrollments</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Yangi Enrollment
        </Button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {loading ? (
        <div className="flex justify-center items-center"><Loader2 className="animate-spin w-6 h-6" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Guruh</th>
                <th className="p-3 text-left">Join Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(enrollments ?? []).map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3">{e.student.fullName}</td>
                  <td className="p-3">{e.student.phone || "-"}</td>
                  <td className="p-3">{e.group.name}</td>
                  <td className="p-3">{new Date(e.joinDate).toLocaleDateString()}</td>
                  <td className="p-3">{e.status}</td>
                  <td className="p-3 flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditEnrollment(e)}>
                      <Edit className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>O‘chirishni tasdiqlang</AlertDialogTitle>
                          <AlertDialogDescription>
                            {`"${e.student.fullName}" enrollmentni o‘chirmoqchimisiz?`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(e.id)}>O‘chirish</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Drawer */}
      <AnimatePresence>
        {createOpen && (
          <CreateEnrollmentDrawer
            onClose={() => setCreateOpen(false)}
            onSuccess={() => { fetchEnrollments(); setCreateOpen(false); }}
          />
        )}
      </AnimatePresence>

      {/* Edit Drawer */}
      <AnimatePresence>
        {editEnrollment && (
          <EditEnrollmentDrawer
            enrollment={editEnrollment}
            onClose={() => setEditEnrollment(null)}
            onSuccess={() => { fetchEnrollments(); setEditEnrollment(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
