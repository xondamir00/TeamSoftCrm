"use client";

import { useState, useEffect, useRef } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from "chart.js";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Wallet,
  CreditCard,
  Users,
  AlertCircle,
  Loader2,
  BarChart3,
  Filter,
  ChevronRight,
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  financeApi,
  type Debtor,
  type FinanceOverview,
  type GlobalBalance,
} from "./homeApi";
import { Link } from "react-router-dom";

// Chart.js elementlarini register qilish
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

type Category = "income" | "expense" | "profit";
type Range = "yearly" | "monthly" | "weekly";
type Period = "this_month" | "last_month" | "last_3_months" | "this_year";

export default function FinanceDashboard() {
  const [category, setCategory] = useState<Category>("income");
  const [range, setRange] = useState<Range>("monthly");
  const [period, setPeriod] = useState<Period>("this_month");
  const [darkMode, setDarkMode] = useState(false);

  // Backend ma'lumotlari
  const [globalBalance, setGlobalBalance] = useState<GlobalBalance | null>(
    null
  );
  const [financeOverview, setFinanceOverview] =
    useState<FinanceOverview | null>(null);
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState({
    balance: true,
    overview: true,
    debtors: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Chart refs
  const lineChartRef = useRef<ChartJS<"line">>(null);
  const doughnutChartRef = useRef<ChartJS<"doughnut">>(null);

  // Backend ma'lumotlarini yuklash
  const fetchFinanceData = async () => {
    try {
      setError(null);
      setLoading({ balance: true, overview: true, debtors: true });

      // Global balans
      const balance = await financeApi.getGlobalBalance();
      setGlobalBalance(balance);
      setLoading((prev) => ({ ...prev, balance: false }));

      // Periodga qarab date range
      let fromDate: string, toDate: string;
      const now = new Date();

      switch (period) {
        case "this_month":
          fromDate = format(startOfMonth(now), "yyyy-MM-dd");
          toDate = format(now, "yyyy-MM-dd");
          break;
        case "last_month":
          const lastMonth = subMonths(now, 1);
          fromDate = format(startOfMonth(lastMonth), "yyyy-MM-dd");
          toDate = format(endOfMonth(lastMonth), "yyyy-MM-dd");
          break;
        case "last_3_months":
          const threeMonthsAgo = subMonths(now, 3);
          fromDate = format(threeMonthsAgo, "yyyy-MM-dd");
          toDate = format(now, "yyyy-MM-dd");
          break;
        case "this_year":
          fromDate = `${now.getFullYear()}-01-01`;
          toDate = format(now, "yyyy-MM-dd");
          break;
        default:
          fromDate = format(startOfMonth(now), "yyyy-MM-dd");
          toDate = format(now, "yyyy-MM-dd");
      }

      // Moliyaviy ko'rish
      const overview = await financeApi.getFinanceOverview(fromDate, toDate);
      setFinanceOverview(overview);
      setLoading((prev) => ({ ...prev, overview: false }));

      // Qarzdorlar (100,000 so'mdan yuqori qarzdorlar)
      const debtorsList = await financeApi.getDebtors(100000);
      setDebtors(debtorsList);
      setLoading((prev) => ({ ...prev, debtors: false }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Ma'lumotlarni yuklashda xatolik";
      setError(errorMessage);
      setLoading({ balance: false, overview: false, debtors: false });
      console.error("Finance data fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [period]);

  // Component unmount bo'lganda chartlarni destroy qilish
  useEffect(() => {
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
      }
    };
  }, []);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Chart data larni tayyorlash
  const getLineChartData = () => {
    const months = [
      "Yan",
      "Fev",
      "Mar",
      "Apr",
      "May",
      "Iyun",
      "Iyul",
      "Avg",
      "Sen",
      "Okt",
      "Noy",
      "Dek",
    ];

    const weeks = ["Hafta 1", "Hafta 22", "Hafta 3", "Hafta 4"];
    const weekdays = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Yak"];

    let labels: string[];
    let data: number[];

    if (range === "yearly") {
      labels = months;
      data = Array.from(
        { length: 12 },
        () => Math.floor(Math.random() * 30) + 10
      );
    } else if (range === "monthly") {
      labels = weeks;
      data = Array.from(
        { length: 4 },
        () => Math.floor(Math.random() * 20) + 5
      );
    } else {
      labels = weekdays;
      data = Array.from(
        { length: 7 },
        () => Math.floor(Math.random() * 15) + 3
      );
    }

    // Kategoriyaga qarab data o'zgartirish
    if (category === "expense") {
      data = data.map((value) => value * 0.6);
    } else if (category === "profit") {
      data = data.map((value) => value * 0.4);
    }

    return { labels, data };
  };

  const { labels: lineLabels, data: lineData } = getLineChartData();

  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label:
          category === "income"
            ? "Tushumlar"
            : category === "expense"
            ? "Chiqimlar"
            : "Foyda",
        data: lineData,
        borderColor: darkMode
          ? category === "income"
            ? "#059669"
            : category === "expense"
            ? "#d97706"
            : "#2563eb"
          : category === "income"
          ? "#10b981"
          : category === "expense"
          ? "#f59e0b"
          : "#3b82f6",
        backgroundColor: darkMode
          ? category === "income"
            ? "#05966920"
            : category === "expense"
            ? "#d9770620"
            : "#2563eb20"
          : category === "income"
          ? "#10b98120"
          : category === "expense"
          ? "#f59e0b20"
          : "#3b82f620",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: darkMode
          ? category === "income"
            ? "#059669"
            : category === "expense"
            ? "#d97706"
            : "#2563eb"
          : category === "income"
          ? "#10b981"
          : category === "expense"
          ? "#f59e0b"
          : "#3b82f6",
        pointBorderColor: darkMode ? "#1f2937" : "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        titleColor: darkMode ? "#f3f4f6" : "#111827",
        bodyColor: darkMode ? "#d1d5db" : "#4b5563",
        borderColor: darkMode ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${
              category === "income"
                ? "Tushum"
                : category === "expense"
                ? "Chiqim"
                : "Foyda"
            }: ${value.toLocaleString("uz-UZ")} so'm`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? "#37415140" : "#e5e7eb",
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? "#9ca3af" : "#6b7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? "#37415140" : "#e5e7eb",
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? "#9ca3af" : "#6b7280",
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return `${value.toLocaleString("uz-UZ")}`;
          },
        },
      },
    },
  };

  // Doughnut chart uchun data
  const doughnutChartData = {
    labels: ["Online to'lov", "Naqd", "Plastik", "Bank o'tkazma"],
    datasets: [
      {
        label: "To'lov usullari",
        data: [45, 30, 15, 10],
        backgroundColor: darkMode
          ? ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"]
          : ["#34d399", "#60a5fa", "#a78bfa", "#fbbf24"],
        borderColor: darkMode ? "#1f2937" : "#ffffff",
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: darkMode ? "#d1d5db" : "#374151",
          padding: 20,
          font: {
            size: 11,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        titleColor: darkMode ? "#f3f4f6" : "#111827",
        bodyColor: darkMode ? "#d1d5db" : "#4b5563",
        borderColor: darkMode ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value}% (${percentage}%)`;
          },
        },
      },
    },
  };

  // So'm formatlash
  const formatSum = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return "0";
    return new Intl.NumberFormat("uz-UZ").format(Math.round(amount));
  };

  const formatCurrency = (amount: number | undefined | null) => {
    return `${formatSum(amount)} so'm`;
  };

  // Loading komponenti
  if (loading.balance && loading.overview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ma'lumotlar yuklanmoqda...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Iltimos, kuting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Moliyaviy Dashboard
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Barcha moliyaviy ko'rsatkichlar va statistikalar bir joyda
            </p>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Income Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-emerald-200 dark:border-emerald-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200 to-transparent dark:from-emerald-800/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20">
                  <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  +12.5%
                </span>
              </div>

              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Umumiy daromad
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {formatCurrency(globalBalance?.totalIncome)}
              </p>

              <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>O'tgan oydan +2.5M so'm</span>
              </div>
            </div>
          </div>

          {/* Total Expense Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-amber-200 dark:border-amber-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200 to-transparent dark:from-amber-800/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/20">
                  <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                  -3.2%
                </span>
              </div>

              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Umumiy xarajat
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {formatCurrency(globalBalance?.totalExpense)}
              </p>

              <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span>O'tgan oydan -800K so'm</span>
              </div>
            </div>
          </div>

          {/* Net Profit Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-blue-200 dark:border-blue-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200 to-transparent dark:from-blue-800/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                  +18.7%
                </span>
              </div>

              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Sof foyda
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {formatCurrency(globalBalance?.netCash)}
              </p>

              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>O'tgan oydan +3.3M so'm</span>
              </div>
            </div>
          </div>

          {/* Total Debt Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-rose-200 dark:border-rose-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-200 to-transparent dark:from-rose-800/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-rose-500/10 dark:bg-rose-500/20">
                  <Users className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                  {debtors.length} ta
                </span>
              </div>

              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Umumiy qarz
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {formatCurrency(globalBalance?.totalDebt)}
              </p>

              <div className="flex items-center text-sm text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>{debtors.length} ta qarzdor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Moliyaviy o'sish dinamikasi
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {range === "yearly"
                    ? "Yillik"
                    : range === "monthly"
                    ? "Oylik"
                    : "Haftalik"}{" "}
                  ko'rsatkichlar
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  {(["income", "expense", "profit"] as Category[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          category === cat
                            ? `bg-gradient-to-r ${
                                cat === "income"
                                  ? "from-emerald-500 to-teal-600"
                                  : cat === "expense"
                                  ? "from-amber-500 to-orange-600"
                                  : "from-blue-500 to-indigo-600"
                              } text-white shadow-lg`
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {cat === "income"
                          ? "Tushum"
                          : cat === "expense"
                          ? "Chiqim"
                          : "Foyda"}
                      </button>
                    )
                  )}
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  {(["yearly", "monthly", "weekly"] as Range[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                        range === r
                          ? "bg-gray-800 dark:bg-gray-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {r === "yearly"
                        ? "Yil"
                        : r === "monthly"
                        ? "Oy"
                        : "Hafta"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-80 lg:h-96">
              <Line
                ref={lineChartRef}
                data={lineChartData}
                options={lineChartOptions}
              />
            </div>
          </div>

          {/* Side Charts */}
          <div className="space-y-6 lg:space-y-8">
            {/* Finance Overview */}
            {financeOverview && (
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-white/20">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Davr natijalari
                    </h3>
                    <p className="text-sm text-blue-100">
                      {format(new Date(financeOverview.from), "dd.MM.yyyy")} -{" "}
                      {format(new Date(financeOverview.to), "dd.MM.yyyy")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <span className="text-sm font-medium text-white">
                      Tushumlar
                    </span>
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(financeOverview.totalIncome)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <span className="text-sm font-medium text-white">
                      Chiqimlar
                    </span>
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(financeOverview.totalExpense)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <span className="text-sm font-medium text-white">
                      Sof foyda
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(financeOverview.profit)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Debtors Section */}
        {debtors.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/20">
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Qarzdorlar ro'yxati
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {debtors.length} ta o'quvchi, jami{" "}
                      {formatCurrency(globalBalance?.totalDebt)} qarz
                    </p>
                  </div>
                </div>

                <button className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to={"debtors"}>
                    <span className="text-sm font-medium">
                      Barchasini ko'rish
                    </span>
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      O'quvchi
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Telefon
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Qarz miqdori
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Guruhlar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {debtors.slice(0, 5).map((debtor, index) => (
                    <tr
                      key={debtor.studentId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-300"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                            {debtor.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {debtor.fullName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {debtor.studentId.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-700 dark:text-gray-300">
                          {debtor.phone}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-semibold">
                          <AlertCircle className="w-3 h-3 mr-2" />
                          {formatCurrency(debtor.totalDebt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {debtor.groups.slice(0, 2).map((group) => (
                            <span
                              key={group.groupId}
                              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                            >
                              {group.name}
                            </span>
                          ))}
                          {debtor.groups.length > 2 && (
                            <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">
                              +{debtor.groups.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {debtors.length > 5 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ... va yana {debtors.length - 5} ta qarzdor ko'rsatilmagan
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl shadow-xl p-6 border border-rose-200 dark:border-rose-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Xatolik yuz berdi
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {error}
                </p>
              </div>
              <button
                onClick={fetchFinanceData}
                className="ml-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Qayta urinish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
