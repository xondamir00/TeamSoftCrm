import { useState, useEffect, useCallback } from "react";
import { api } from "@/Service/ApiService/api";
import type { Enrollment } from "@/Store";

interface Filters {
  studentId?: string;
  groupId?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export function useEnrollments(filters: Filters = {}) {
  const [data, setData] = useState<Enrollment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);

      const params: Record<string, string | number | undefined> = {};

      if (filters.studentId) params.studentId = filters.studentId;
      if (filters.groupId) params.groupId = filters.groupId;
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      params.page = filters.page || 1;
      params.limit = filters.limit || 10;

      const res = await api.get<{
        data: Enrollment[];
        total: number;
      }>("/enrollments", { params });

      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error loading enrollments:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return { data, total, loading, refetch: fetchEnrollments };
}
