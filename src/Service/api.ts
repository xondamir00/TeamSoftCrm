import { useAuth } from "@/Store";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor: access tokenni yuborish
api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: 401 bo‘lsa refresh token bilan tokenni yangilash
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, logout, login } = useAuth.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { token: refreshToken },
          { withCredentials: true }
        );

        if (data?.accessToken && data?.refreshToken && data.user) {
          login(data.accessToken, data.refreshToken, data.user);
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } else {
          logout();
          return Promise.reject(error);
        }
      } catch (err) {
        logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
