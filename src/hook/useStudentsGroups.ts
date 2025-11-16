import { useState, useCallback } from "react";
import { api } from "@/Service/api";
import type { Group, Student } from "@/Store";

export function useStudentsGroups() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const studentsRes = await api.get<{ items: Student[] }>("/students");
      const groupsRes = await api.get<{ items: Group[] }>("/groups");

      console.log("STUDENTS RESPONSE:", studentsRes.data);
      console.log("GROUPS RESPONSE:", groupsRes.data);

      setStudents(studentsRes.data.items);
      setGroups(groupsRes.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { students, groups, loading, load };
}
