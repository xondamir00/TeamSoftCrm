import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { api } from "@/Service/api";
import { useAuth } from "@/Store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, i18n } = useTranslation();

  const [phone, setPhone] = useState("+998900001122");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { phone, password });

      const { user, accessToken, refreshToken } = data;

      // ✔ TO‘G‘RI TASNIF
      if (!accessToken || !refreshToken || !user) {
        setError(t("error_invalid"));
        return;
      }
      console.log(data);

      // Token va userni storega saqlash
      login(accessToken, refreshToken, user);

      // Rolga qarab redirect
      switch (user.role) {
        case "ADMIN":
        case "MANAGER":
          navigate("/admin");
          break;
        case "TEACHER":
          navigate("/teacher");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    } catch (err: any) {
      setError(t("error_invalid"));
    } finally {
      setLoading(false);
    }
  };

  console.log('Sending phone:', phone);
console.log('Sending password:', password);

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <img
        src="/public/loginbg/loginbg.avif"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-10"
      />
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col items-center justify-center w-[30%] p-10 relative z-10"
      >
        <motion.img
          src="/public/loginbg/login.webp"
          alt="login illustration"
          className=" ml-[-120px] max-w-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-6 md:px-8 py-10 z-20"
      >
        <Card className="relative shadow-[0_8px_20px_-10px_rgba(59,130,246,0.5)] border border-blue-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl transition-all duration-500 hover:shadow-[0_8px_40px_-10px_rgba(59,130,246,0.7)] hover:scale-[1.02]">
          <CardHeader className="relative z-10 text-center space-y-2">
            <CardTitle className="text-3xl font-extrabold text-[#3F8CFF]">
              {t("login_title")}
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("login_subtitle")}
            </p>
          </CardHeader>

          <CardContent className="relative z-10 mt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-center text-sm font-medium"
                >
                  {error}
                </motion.p>
              )}

              {/* Phone input */}
              <div className="relative">
                <Phone
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phone_placeholder")}
                  className="pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800/70 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("password_placeholder")}
                  className="pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800/70 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-blue-500 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-3 text-lg font-semibold text-white rounded-xl transition-all duration-300 bg-gradient-to-r from-[#3F8CFF] to-indigo-700 hover:from-blue-700 hover:to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading ? t("loading") : t("login_button")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
