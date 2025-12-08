"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Loader2, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SheetCard from "./sheed-card";
import EmptyState from "./emty-state";
import { useAttendanceStore } from "@/Service/AttendanceService";

const Attendancepage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [lessonNumber, setLessonNumber] = useState(1);
  

  const {
    sheets,
    group,
    loading,
    saving,
    error,
    editingSheetId,
    comment,
    fetchGroupInfo,
    getOrCreateSheet,
    updateLocalStatus,
    setEditingComment,
    saveComment,
    updateCommentText,
    saveSheet,
    deleteSheet,
    clearError,
    resetEditing,
  } = useAttendanceStore();

  useEffect(() => {
    if (groupId) {
      fetchGroupInfo(groupId);
    }
  }, [groupId, fetchGroupInfo]);
  const handleGetOrCreateSheet = async () => {
    if (!groupId) return;
    
    try {
      clearError();
      await getOrCreateSheet(groupId, selectedDate, lessonNumber);
      setOpenModal(false);
    } catch (err) {
      console.error("Sheet yaratishda xato:", err);
    }
  };

  const handleAddComment = (sheetId: string, studentId: string) => {
    setEditingComment(sheetId, studentId);
  };

  const handleSaveComment = () => {
    saveComment();
  };

  const handleSaveSheet = async (sheetId: string) => {
    try {
      clearError();
      await saveSheet(sheetId);
    } catch (err) {
      console.error("Sheet saqlashda xato:", err);
    }
  };

  const handleDeleteSheet = async (sheetId: string) => {
    if (!confirm("Haqiqatan ham bu sheetni o'chirmoqchimisiz?")) return;
    try {
      clearError();
      await deleteSheet(sheetId);
    } catch (err) {
      console.error("Sheet o'chirishda xato:", err);
    }
  };
  const handleBack = () => {navigate(-1);};

  if (!groupId) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Alert variant="destructive">
          <AlertDescription>Guruh ID topilmadi</AlertDescription>
        </Alert>
      </div>
    );
  }
console.log(group?.groupName);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Davomat Jadvali
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {group?.groupName || `Guruh ${groupId}`}
              {group?.room && ` • ${group.room.name}`}
            </p>
          </div>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Calendar className="w-4 h-4 mr-2" />
              Yangi Sheet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi Davomat Jadvali</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 ">
              <div>
                <Label htmlFor="date">Sana</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lesson">Dars raqami</Label>
                <Input
                  id="lesson"
                  type="number"
                  min="1"
                  max="8"
                  value={lessonNumber}
                  onChange={(e) => setLessonNumber(Number(e.target.value))}
                />
              </div>
              <Button
                onClick={handleGetOrCreateSheet}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Jadval yaratish"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog
        open={!!editingSheetId}
        onOpenChange={(open) => {
          if (!open) {
            resetEditing();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Izoh qo'shish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={comment}
              onChange={(e) => updateCommentText(e.target.value)}
              placeholder="Izoh yozing..."
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetEditing}
                className="flex-1"
              >
                Bekor qilish
              </Button>
              <Button onClick={handleSaveComment} className="flex-1  ">
                Saqlash
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-600 mt-2">Yuklanmoqda...</p>
        </div>
      )}

      <div className="space-y-6">
        {sheets.map((sheet) => (
          <SheetCard
            key={sheet.sheetId}
            sheet={sheet}
            onStatusChange={updateLocalStatus}
            onAddComment={handleAddComment}
            onSave={handleSaveSheet}
            onDelete={handleDeleteSheet}
            saving={saving}
          />
        ))}
        {sheets.length === 0 && !loading && (
          <EmptyState onOpenModal={() => setOpenModal(true)} />
        )}
      </div>
    </div>
  );
};

export default Attendancepage;