import { useState, useCallback } from "react";
import { api } from "@/Service/api";

export function useStudentsGroups() {
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const studentsRes = await api.get("/students");
      const groupsRes = await api.get("/groups");

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
