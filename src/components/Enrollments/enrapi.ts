import { api } from "@/Service/api";

export const getStudents = () => api.get("/students");

export const getGroups = () => api.get("/groups");

export const getEnrollments = () => api.get("/enrollments");


export const createEnrollment = (data: {
  studentId: string;
  groupId: string;
}) => api.post("/enrollments", data);
