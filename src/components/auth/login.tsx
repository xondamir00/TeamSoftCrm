import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/Service/api";
import { useAuth } from "@/Store";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("+998900001122");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { phone, password });
      console.log("Login response:", data);

      const { user, accessToken } = data;

      if (!accessToken || !user) {
        setError("Login ma'lumotlari to‘liq emas yoki noto‘g‘ri.");
        return;
      }

      login(accessToken, user);

      switch (user.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "MANAGER":
          navigate("/manager/panel");
          break;
        case "USER":
        default:
          navigate("/dashboard");
          break;
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Tizimga kirishda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-black px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">
          Tizimga kirish
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Telefon raqamingiz
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
            placeholder="+998901234567"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Parolingiz
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
            placeholder="*******"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Kirish..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}
