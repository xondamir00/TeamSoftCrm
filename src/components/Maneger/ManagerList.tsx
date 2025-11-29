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
import { managerAPI } from "./manager";

export default function ManagerList() {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedManager, setSelectedManager] = useState<any | null>(null);

  const [form, setForm] = useState({
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
      setAlertMessage("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Open Edit form only
  const openEditForm = (manager: any) => {
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
      setAlertMessage("Updated successfully");
      setDialogOpen(false);
      fetchManagers();
    } catch (e: any) {
      console.error(e);
      setAlertMessage(e.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleDelete = async () => {
    if (!selectedManager) return;
    try {
      await managerAPI.delete(selectedManager.id);
      setAlertMessage("Deleted successfully");
      setDeleteDialogOpen(false);
      fetchManagers();
    } catch (e: any) {
      console.error(e);
      setAlertMessage(e.response?.data?.message || "O'chirishda xatolik");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10  space-y-6">
      <h1 className="text-3xl font-bold">Managers List</h1>

      <Card className="shadow-xl p-2 rounded-2xl">
        <CardContent>
          {loading ? (
            <p className="text-center py-6">Loading...</p>
          ) : managers.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No managers found</p>
          ) : (
            <div className="space-y-4">
              {managers.map((m: any) => (
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
                    <p className="text-sm text-gray-600">📞 {m.phone}</p>
                    {m.monthlySalary && (
                      <p className="text-sm text-gray-600">
                        💰 {m.monthlySalary} so'm
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => openEditForm(m)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedManager(m);
                        setDeleteDialogOpen(true);
                      }}
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

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Manager</DialogTitle>
            <DialogDescription>
              Update the manager details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-3">
            <div>
              <Label>First Name</Label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone (+998XXXXXXXXX)</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <Label>Photo URL</Label>
              <Input
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
              />
            </div>
            <div>
              <Label>Monthly Salary</Label>
              <Input
                type="number"
                value={form.monthlySalary}
                onChange={(e) =>
                  setForm({ ...form, monthlySalary: e.target.value })
                }
              />
            </div>
            <Button className="w-full mt-2" onClick={handleUpdate}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Manager?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this manager? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert */}
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
