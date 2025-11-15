"use client";

import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { data } from "react-router-dom";

export const TeachingAssignmentForm = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const [teacherId, setTeacherId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [role, setRole] = useState("LEAD");
  const [note, setNote] = useState("");

  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ma'lumotlarni olish
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teacherRes, groupRes] = await Promise.all([
          api.get("/teachers"),
          api.get("/groups"),
        ]);

        setTeachers(
          Array.isArray(teacherRes.data.items) ? teacherRes.data.items : []
        );
        console.log(teachers);

        setGroups(Array.isArray(groupRes.data) ? groupRes.data : []);
      } catch (err: any) {
        setError("Ma'lumotlarni olishda xato yuz berdi");
        setOpenAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !groupId) return;

    try {
      await api.post("/teaching-assignments", {
        teacherId,
        groupId,
        role,
        note,
      });
      onSuccess();
      setTeacherId("");
      setGroupId("");
      setRole("LEAD");
      setNote("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Xato yuz berdi");
      setOpenAlert(true);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Ma'lumotlar yuklanmoqda...
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 bg-white dark:bg-black border dark:border-gray-700 rounded-xl shadow-md"
      >
        {/* Teacher select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            O'qituvchi
          </label>
          <Select value={teacherId} onValueChange={setTeacherId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="O'qituvchi tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Teachers</SelectLabel>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Group select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Guruh
          </label>
          <Select value={groupId} onValueChange={setGroupId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Guruh tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Groups</SelectLabel>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Role select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="LEAD">LEAD</SelectItem>
                <SelectItem value="ASSISTANT">ASSISTANT</SelectItem>
                <SelectItem value="SUBSTITUTE">SUBSTITUTE</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Note input */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Qo'shimcha izoh"
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Add Assignment
        </Button>
      </form>

      {/* Error Alert */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xatolik</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              Yopish
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpenAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
