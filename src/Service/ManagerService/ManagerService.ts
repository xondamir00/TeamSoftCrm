import { api } from "@/Service/ApiService/api";

export const managerAPI = {
  fetch: async () => {
    const res = await api.get("/managers");
    return res.data || [];
  },
  update: async (id: string, payload: any) =>
    await api.patch(`/managers/${id}`, payload),
  delete: async (id: string) => await api.delete(`/managers/${id}`),
};
