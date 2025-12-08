"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { managerAPI } from "../../Service/ManagerService/ManagerService";
import { useTranslation } from "react-i18next";
import type { FormData, Manager } from "@/Store/Meneger/MenegerInterface";


export default function ManagerList() {
  const { t } = useTranslation();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    photoUrl: "",
    monthlySalary: "",
  });

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const data = await managerAPI.fetch();
      setManagers(data);
    } catch (e) {
      console.error(e);
      setAlertMessage(t("managerManagement.error") || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const openEditForm = (manager: Manager) => {
    setSelectedManager(manager);
    setForm({
      firstName: manager.firstName || "",
      lastName: manager.lastName || "",
      phone: manager.phone
        ? manager.phone.startsWith("+998")
          ? manager.phone
          : "+998" + manager.phone.replace(/^0/, "")
        : "",
      password: "",
      photoUrl: manager.photoUrl || "",
      monthlySalary: manager.monthlySalary ? String(manager.monthlySalary) : "",
    });
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedManager) return;
    try {
      const payload: any = {
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        phone: form.phone || undefined,
        password: form.password || undefined,
        photoUrl: form.photoUrl || undefined,
        monthlySalary: form.monthlySalary
          ? Number(form.monthlySalary)
          : undefined,
      };
      await managerAPI.update(selectedManager.id, payload);
      setAlertMessage(t("managerManagement.updatedSuccess") || "Updated successfully");
      setDialogOpen(false);
      fetchManagers();
    } catch (e: any) {
      console.error(e);
      setAlertMessage(e.response?.data?.message || t("managerManagement.error") || "Xatolik yuz berdi");
    }
  };

  const handleDelete = async () => {
    if (!selectedManager) return;
    try {
      await managerAPI.delete(selectedManager.id);
      setAlertMessage(t("managerManagement.deletedSuccess") || "Deleted successfully");
      setDeleteDialogOpen(false);
      fetchManagers();
    } catch (e: any) {
      console.error(e);
      setAlertMessage(e.response?.data?.message || t("managerManagement.deleteError") || "O'chirishda xatolik");
    }
  };

  const formatPhone = (phone: string): string => {
    if (!phone) return "";
    if (phone.startsWith("+998")) return phone;
    if (phone.startsWith("998")) return "+" + phone;
    if (phone.startsWith("0")) return "+998" + phone.substring(1);
    return "+998" + phone;
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold">
        {t("managerManagement.title") || "Managers List"}
      </h1>

      <Card className="shadow-xl p-2 rounded-2xl bg-white dark:bg-slate-900">
        <CardContent>
          {loading ? (
            <p className="text-center py-6">
              {t("managerManagement.loading") || "Loading..."}
            </p>
          ) : managers.length === 0 ? (
            <p className="text-center py-6 text-gray-500">
              {t("managerManagement.noManagers") || "No managers found"}
            </p>
          ) : (
            <div className="space-y-4">
              {managers.map((m: Manager) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center p-4 border rounded-xl shadow hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {m.firstName} {m.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      📞 {formatPhone(m.phone)}
                    </p>
                    {m.monthlySalary && (
                      <p className="text-sm text-gray-600">
                        💰 {m.monthlySalary.toLocaleString()} so'm
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => openEditForm(m)}
                      title={t("managerManagement.editManager") || "Edit Manager"}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedManager(m);
                        setDeleteDialogOpen(true);
                      }}
                      title={t("managerManagement.delete") || "Delete"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>
              {t("managerManagement.editManager") || "Edit Manager"}
            </DialogTitle>
            <DialogDescription>
              {t("managerManagement.editDescription") || "Update the manager details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-3">
            <div>
              <Label>
                {t("managerManagement.firstName") || "First Name"}
              </Label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                placeholder={t("managerManagement.firstName") || "First Name"}
              />
            </div>
            <div>
              <Label>
                {t("managerManagement.lastName") || "Last Name"}
              </Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder={t("managerManagement.lastName") || "Last Name"}
              />
            </div>
            <div>
              <Label>
                {t("managerManagement.phone") || "Phone (+998XXXXXXXXX)"}
              </Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t("managerManagement.phonePlaceholder") || "Phone"}
              />
            </div>
            <div>
              <Label>
                {t("managerManagement.password") || "Password"}
              </Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={t("managerManagement.password") || "Password"}
              />
            </div>
            <div>
              <Label>
                {t("managerManagement.photoUrl") || "Photo URL"}
              </Label>
              <Input
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                placeholder={t("managerManagement.photoUrl") || "Photo URL"}
              />
            </div>
            <div>
              <Label>
                {t("managerManagement.monthlySalary") || "Monthly Salary"}
              </Label>
              <Input
                type="number"
                value={form.monthlySalary}
                onChange={(e) =>
                  setForm({ ...form, monthlySalary: e.target.value })
                }
                placeholder={t("managerManagement.salaryPlaceholder") || "Salary"}
              />
            </div>
            <Button className="w-full mt-2" onClick={handleUpdate}>
              {t("managerManagement.saveChanges") || "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl dark:bg-slate-900 bg-white">
          <DialogHeader>
            <DialogTitle>
              {t("managerManagement.deleteManager") || "Delete Manager?"}
            </DialogTitle>
            <DialogDescription>
              {t("managerManagement.deleteDescription") || "Are you sure you want to delete this manager? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("managerManagement.cancel") || "Cancel"}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("managerManagement.delete") || "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {alertMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 w-72"
        >
          <Alert variant="default">
            <AlertTitle>{alertMessage}</AlertTitle>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}