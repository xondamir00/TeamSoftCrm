import { useEffect, useState } from "react";
import { api } from "@/Service/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

interface EditStudentProps {
  studentId: string;
  onUpdated?: () => void;
}

interface StudentForm {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  startDate: string;
  isActive: boolean;
}

export default function EditStudent({
  studentId,
  onUpdated,
}: EditStudentProps) {
  const [form, setForm] = useState<StudentForm>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    startDate: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Fetch student data safely
  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students/${studentId}`);
      const student = res.data;

      setForm({
        firstName:
          student.user?.firstName || student.fullName?.split(" ")[0] || "",
        lastName:
          student.user?.lastName || student.fullName?.split(" ")[1] || "",
        phone: student.user?.phone || student.phone || "",
        password: "",
        dateOfBirth: student.dateOfBirth?.split("T")[0] || "",
        startDate: student.startDate?.split("T")[0] || "",
        isActive: student.user?.isActive ?? student.isActive ?? true,
      });
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", message: "Student ma'lumotlari olinmadi!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchStudent();
  }, [studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/students/${studentId}`, form);
      setAlert({ type: "success", message: "Student updated successfully!" });
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", message: "Error updating student!" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-400 dark:text-gray-500">
        Loading student data...
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-900 dark:text-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Edit Student
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alert.message && (
            <Alert
              className={`mb-4 ${
                alert.type === "success"
                  ? "border-green-500 text-green-700 dark:border-green-400 dark:text-green-300"
                  : "border-red-500 text-red-700 dark:border-red-400 dark:text-red-300"
              }`}
            >
              {alert.type === "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <AlertTitle>
                {alert.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              <Label>Active</Label>
            </div>
            <Button type="submit" className="w-full">
              💾 Update Student
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
