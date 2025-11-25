import  { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";

export default function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      const res = await api.get("/managers");
      setManagers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const openEdit = (m: any) => {
    setSelectedId(m.id);
    setForm({
      firstName: m.firstName,
      lastName: m.lastName,
      phone: m.phone,
      password: "",
      photoUrl: m.photoUrl || "",
      monthlySalary: m.monthlySalary || "",
    });
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/managers/${selectedId}`, {
        ...form,
        monthlySalary: form.monthlySalary ? Number(form.monthlySalary) : undefined,
      });

      setAlertMessage("updated");
      setDialogOpen(false);
      fetchManagers();
    } catch (e: any) {
      setAlertMessage(e.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/managers/${selectedId}`);
      setAlertMessage("deleted");
      setDeleteDialogOpen(false);
      fetchManagers();
    } catch (e: any) {
      setAlertMessage(e.response?.data?.message || "O'chirishda xatolik");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card className="p-5 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Managers List</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-3">
              {managers.map((m: any) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border p-4 rounded-xl flex justify-between items-center shadow"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{m.firstName} {m.lastName}</p>
                    <p className="text-sm text-gray-600">📞 {m.phone}</p>
                    {m.monthlySalary && (
                      <p className="text-sm text-gray-600">💰 {m.monthlySalary} so'm</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => openEdit(m)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" onClick={() => { setSelectedId(m.id); setDeleteDialogOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Manager</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-3">
            <div>
              <Label>First Name</Label>
              <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <Label>Photo URL</Label>
              <Input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} />
            </div>
            <div>
              <Label>Monthly Salary</Label>
              <Input type="number" value={form.monthlySalary} onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })} />
            </div>

            <Button className="w-full" onClick={handleUpdate}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Manager?</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700">Are you sure you want to delete this manager?</p>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ALERT */}
      {alertMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 w-72"
        >
          <Alert variant={alertMessage === "updated" || alertMessage === "deleted" ? "default" : "destructive"}>
            <AlertTitle>{alertMessage === "updated" ? "Updated" : alertMessage === "deleted" ? "Deleted" : "Error"}</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
