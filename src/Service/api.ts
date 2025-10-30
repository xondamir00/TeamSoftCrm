import { useAuth } from "@/Store";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let waiters: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as any;

    // 401 va retry qilinmagan request
    if (error.response?.status === 401 && !original._retry) {
      if (refreshing) {
        // Boshqa refresh kutish
        await new Promise<void>((res) => waiters.push(res));
        original.headers.Authorization = `Bearer ${useAuth.getState().token}`;
        original._retry = true;
        return api(original);
      }

      try {
        refreshing = true;
        original._retry = true;

        const { data } = await refreshApi.post("/auth/refresh");

        if (data?.accessToken && data.user) {
          // Yangilangan tokenni store ga saqlash
          useAuth.getState().login(data.accessToken, data.user);

          // Barcha kutayotgan requestlarni ishlatish
          waiters.forEach((fn) => fn());
          waiters = [];

          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } else {
          useAuth.getState().logout();
          throw new Error("Refresh muvaffaqiyatsiz");
        }
      } catch (e) {
        waiters.forEach((fn) => fn());
        waiters = [];
        useAuth.getState().logout();
        throw e;
      } finally {
        refreshing = false;
      }
    }

    throw error;
  }
);
