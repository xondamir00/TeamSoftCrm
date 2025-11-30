import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/Service/api";
import { useTranslation } from "react-i18next";
import type { CreateTeacherPayload } from "@/Store";
import { AxiosError } from "axios";
import { X, Loader2 } from "lucide-react";

interface ApiError {
  message?: string;
}

interface AddTeacherDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddTeacherDrawer({
  open,
  onClose,
  onAdded,
}: AddTeacherDrawerProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<CreateTeacherPayload>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    photoUrl: "",
    monthlySalary: undefined,
    percentShare: undefined,
  });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "monthlySalary" || name === "percentShare") {
    setForm((prev) => ({
      ...prev,
      [name]: value.trim() === "" ? undefined : value, // string
    }));
    return;
  }

  setForm((prev) => ({ ...prev, [name]: value }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const payload: CreateTeacherPayload = {
        ...form,
        photoUrl:
          form.photoUrl && form.photoUrl.startsWith("http")
            ? form.photoUrl
            : undefined,
      };

      if (payload.monthlySalary && payload.percentShare) {
        setError(t("salary_warning") || "Cannot set both salary and percent share");
        setLoading(false);
        return;
      }

      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof CreateTeacherPayload] === undefined) {
          delete payload[key as keyof CreateTeacherPayload];
        }
      });

      await api.post("/teachers", payload);

      setSuccess(true);
      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        photoUrl: "",
        monthlySalary: undefined,
        percentShare: undefined,
      });

      setTimeout(() => {
        onAdded();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      const apiError = err as AxiosError<ApiError>;
      setError(apiError.response?.data?.message || t("error") || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Add Teacher
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg text-sm">
                Teacher added successfully!
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                First Name
              </label>
              <Input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                disabled={loading}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Last Name
              </label>
              <Input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                disabled={loading}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <Input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                disabled={loading}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={loading}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Photo URL
              </label>
              <Input
                type="text"
                name="photoUrl"
                value={form.photoUrl || ""}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                disabled={loading}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Monthly Salary
              </label>
              <Input
                type="number"
                name="monthlySalary"
                value={form.monthlySalary ?? ""}
                onChange={handleChange}
                placeholder="0"
                disabled={loading}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Percent Share
              </label>
              <Input
                type="number"
                name="percentShare"
                value={form.percentShare ?? ""}
                onChange={handleChange}
                placeholder="0"
                disabled={loading}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              Note: Set either monthly salary or percent share, not both.
            </div>
          </form>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 dark:border-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Adding..." : "Add Teacher"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
