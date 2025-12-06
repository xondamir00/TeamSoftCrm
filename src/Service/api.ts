// src/Service/api.ts
import { useAuth } from "@/Store";
import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookies yuborish uchun
});

// Request interceptor: access tokenni yuborish
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuth.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Type definition for retry config
interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Response interceptor: 401 bo'lsa refresh token bilan yangilash
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: RetryConfig }) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, logout, login, user } = useAuth.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        // Refresh endpoint: body bo'sh, cookie orqali token olinadi
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (data?.accessToken && data?.refreshToken) {
          // store ga yangilangan tokenlarni saqlash
          login(data.accessToken, data.refreshToken, user);

          // original requestga yangi access token qo'shish
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

          // requestni qayta yuborish
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