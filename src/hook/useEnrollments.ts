// src/hooks/useEnrollments.ts
import { useState, useEffect, useCallback } from "react";
import { api } from "@/Service/api";

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
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);

      const params: any = {};

      if (filters.studentId) params.studentId = filters.studentId;
      if (filters.groupId) params.groupId = filters.groupId;
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      params.page = filters.page || 1;
      params.limit = filters.limit || 10;

      const res = await api.get("/enrollments", { params });

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
