import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { useStudentStore, type CreateStudentDto } from "@/Store/Student";

export default function AddStudent() {
  const [form, setForm] = useState<CreateStudentDto>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    startDate: "",
  });

  const [alert, setAlert] = useState({ type: "", message: "" });

  const createStudent = useStudentStore((state) => state.createStudent);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createStudent(form);
      setAlert({ type: "success", message: "Student added successfully!" });
      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        dateOfBirth: "",
        startDate: "",
      });
    } catch (error) {
      setAlert({ type: "error", message: "Error adding student!" });
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 sm:p-8 space-y-4 transition-colors duration-300">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center mb-4">
        Add New Student
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
          <Input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>

        <div>
          <Label>Date of Birth</Label>
          <Input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
        </div>

        <div>
          <Label>Start Date</Label>
          <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </div>

        <Button type="submit" className="w-full shadow-lg hover:shadow-xl bg-blue-600 hover:bg-blue-700 text-white">
          ➕ Add Student
        </Button>
      </form>
    </div>
  );
}
