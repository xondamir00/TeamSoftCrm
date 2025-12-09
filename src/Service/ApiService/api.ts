// src/Service/api.ts
import { useAuth } from "@/Store";
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from "axios";

// ✅ BASE_URL ni to'g'ri fallback bilan yozish
const BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://crm-production-9e6b.up.railway.app";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ---- 1) Har bir so'rovga access token qo'shish ----
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuth.getState().token;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---- 2) Retry config ----
interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// ---- 3) 401 bo'lsa avtomatik refresh ----
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: RetryConfig }) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const { logout, user } = useAuth.getState(); // `user` ni olish kerak

      try {
        // refresh token cookie orqali yuboriladi
        const { data } = await api.post<{ accessToken: string }>(
          "/auth/refresh",
          {}
        );

        if (data?.accessToken && user) {
          // Tokenni yangilash uchun `login` methodini ishlating
          const authStore = useAuth.getState();
          authStore.login(
            data.accessToken, // yangi token
            "", // refreshToken - agar backend kerak bo'lsa, bo'sh qoldiring
            user // mavjud user
          );

          // Original requestni qayta yuborish
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;

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
