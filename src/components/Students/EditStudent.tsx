import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { useStudentStore } from "@/Store/Student";

interface EditStudentProps {
  studentId: number;
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

export default function EditStudent({ studentId, onUpdated }: EditStudentProps) {
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

  const getStudentById = useStudentStore((state) => state.getStudentById);
  const updateStudent = useStudentStore((state) => state.updateStudent);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const student = await getStudentById(studentId);

        let firstName = student.firstName ?? "";
        let lastName = student.lastName ?? "";

        if (!firstName && !lastName && student.fullName) {
          const names = student.fullName.split(" ");
          firstName = names[0] ?? "";
          lastName = names.slice(1).join(" ") ?? "";
        }

        setForm({
          firstName,
          lastName,
          phone: student.phone ?? "",
          password: "",
          dateOfBirth: student.dateOfBirth?.split("T")[0] ?? "",
          startDate: student.startDate?.split("T")[0] ?? "",
          isActive: student.isActive ?? true,
        });
      } catch (error) {
        console.error(error);
        setAlert({ type: "error", message: "Student ma'lumotlari olinmadi!" });
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchStudent();
  }, [studentId, getStudentById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStudent(studentId, form);
      setAlert({ type: "success", message: "Student updated successfully!" });
      onUpdated?.();
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 sm:p-8 space-y-4 transition-colors duration-300">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center mb-4">
        Edit Student
      </h2>

      {alert.message && (
        <Alert
          className={`flex items-start gap-2 p-3 rounded-lg border ${
            alert.type === "success"
              ? "border-emerald-500 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300"
              : "border-red-500 text-red-700 dark:border-red-400 dark:text-red-300"
          }`}
        >
          {alert.type === "success" ? <CheckCircle2 className="w-5 h-5 mt-1" /> : <XCircle className="w-5 h-5 mt-1" />}
          <div className="flex-1">
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>First Name</Label>
          <Input name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phone" value={form.phone} onChange={handleChange} required />
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
          <Input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
        </div>
        <div>
          <Label>Start Date</Label>
          <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </div>
        <div className="flex items-center gap-2">
          <Input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          <Label>Active</Label>
        </div>
        <Button type="submit" className="w-full shadow-lg hover:shadow-xl">
          💾 Update Student
        </Button>
      </form>
    </div>
  );
}
