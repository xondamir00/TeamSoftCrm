import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { useStudentStore, type CreateStudentDto } from "@/Store/Student";

function AddStudent() {
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
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md shadow-lg dark:bg-gray-900 dark:text-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Add New Student
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alert.message && (
            <Alert
              className={`mb-4 flex items-start gap-2 border-l-4 p-2 ${
                alert.type === "success"
                  ? "border-green-500 text-green-700 dark:border-green-400 dark:text-green-300"
                  : "border-red-500 text-red-700 dark:border-red-400 dark:text-red-300"
              }`}
            >
              {alert.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 mt-1" />
              ) : (
                <XCircle className="h-5 w-5 mt-1" />
              )}
              <div>
                <AlertTitle className="font-semibold">
                  {alert.type === "success" ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </div>
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
                required
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

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              ➕ Add Student
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddStudent;
