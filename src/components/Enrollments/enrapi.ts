import { api } from "@/Service/api";

// 🔹 Studentlarni olish
export const getStudents = () => api.get("/students");

// 🔹 Guruhlarni olish
export const getGroups = () => api.get("/groups");

// 🔹 Enrollments ro'yxatini olish
export const getEnrollments = () => api.get("/enrollments");

// 🔹 Talabani guruhga biriktirish (MODAL buyurtma qiladi)
// data = { studentId: string, groupId: string }
export const createEnrollment = (data: {
  studentId: string;
  groupId: string;
}) => api.post("/enrollments", data);
