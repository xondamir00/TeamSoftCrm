"use client";

import { useState, useEffect } from "react";
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
} from "chart.js";
import { TrendingUp, TrendingDown, DollarSign, PieChart, } from "lucide-react";
import { useTranslation } from "react-i18next";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

type Category = "tushumlar" | "chiqimlar" | "foyda";
type Range = "yillik" | "oylik" | "haftalik";
type Language = "uz" | "ru" | "en";

export default function Home() {
  const { t, i18n } = useTranslation();
  
  const [category, setCategory] = useState<Category>("tushumlar");
  const [range, setRange] = useState<Range>("yillik");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>("uz");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const COLORS = {
    tushumlar: {
      primary: "#10b981",
      primaryDark: "#059669",
      gradient: "from-emerald-500 to-teal-600",
      gradientDark: "from-emerald-600 to-teal-700",
      light: "bg-emerald-50 dark:bg-emerald-900/20",
      dark: "dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800"
    },
    chiqimlar: {
      primary: "#f59e0b",
      primaryDark: "#d97706",
      gradient: "from-amber-500 to-orange-600",
      gradientDark: "from-amber-600 to-orange-700",
      light: "bg-amber-50 dark:bg-amber-900/20",
      dark: "dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800"
    },
    foyda: {
      primary: "#3b82f6",
      primaryDark: "#2563eb",
      gradient: "from-blue-500 to-indigo-600",
      gradientDark: "from-blue-600 to-indigo-700",
      light: "bg-blue-50 dark:bg-blue-900/20",
      dark: "dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800"
    }
  };
  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];
  const dataSets = {
    yillik: {
      labels: [t("jan"), t("feb"), t("mar"), t("apr"), t("may"), t("jun"), t("jul"), t("aug"), t("sep"), t("oct"), t("nov"), t("dec")],
      tushumlar: [5, 6, 8, 9, 10, 11, 12, 13, 15, 17, 18, 20],
      chiqimlar: [3, 3.5, 4, 4.5, 5, 5.2, 6, 7, 8, 9, 10, 11],
      foyda: [2, 2.5, 4, 4.5, 5, 5.8, 6, 6.5, 7, 8, 8, 9],
    },
    oylik: {
      labels: [t("week1"), t("week2"), t("week3"), t("week4")],
      tushumlar: [12, 14, 16, 18],
      chiqimlar: [4, 5, 6, 7],
      foyda: [8, 9, 10, 11],
    },
    haftalik: {
      labels: [t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat"), t("sun")],
      tushumlar: [3, 4, 3.5, 5, 6, 7, 6],
      chiqimlar: [1, 1.5, 2, 2.5, 3, 3, 2.5],
      foyda: [2, 2.5, 1.5, 2.5, 3, 4, 3.5],
    },
  };

  const currentMonthData = {
    labels: [t("week1"), t("week2"), t("week3"), t("week4")],
    tushumlar: [15, 18, 22, 25],
    chiqimlar: [8, 10, 12, 14],
    foyda: [7, 8, 10, 11],
  };
  const selected = dataSets[range];
  const activeValues = selected[category];
  const chartData = {
    labels: selected.labels,
    datasets: [
      {
        label: t(category),
        data: activeValues,
        borderColor: darkMode ? COLORS[category].primaryDark : COLORS[category].primary,
        backgroundColor: darkMode ? `${COLORS[category].primaryDark}20` : `${COLORS[category].primary}20`,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: darkMode ? COLORS[category].primaryDark : COLORS[category].primary,
        pointBorderColor: darkMode ? "#1f2937" : "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        boxPadding: 6,
        callbacks: {
          label: (context: any) => `${context.parsed.y} ${t("mln_sum")}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? "#374151" : "#e5e7eb",
        },
        ticks: {
          color: darkMode ? "#9ca3af" : "#6b7280",
        },
      },
      y: {
        grid: {
          color: darkMode ? "#374151" : "#e5e7eb",
        },
        ticks: {
          color: darkMode ? "#9ca3af" : "#6b7280",
          callback: function(value: any) {
            return `${value} ${t("mln")}`;
          }
        },
      },
    },
  };

  const pieChartData = {
    labels: currentMonthData.labels,
    datasets: [
      {
        label: t("current_month"),
        data: currentMonthData[category],
        backgroundColor: darkMode 
          ? ["#059669", "#10b981", "#34d399", "#6ee7b7"]
          : ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
        borderColor: darkMode ? "#1f2937" : "#ffffff",
        borderWidth: 2,
      },
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: darkMode ? "#d1d5db" : "#374151",
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        titleColor: darkMode ? "#f3f4f6" : "#111827",
        bodyColor: darkMode ? "#d1d5db" : "#4b5563",
        borderColor: darkMode ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${context.parsed} ${t("mln_sum")}`,
        },
      },
    },
  };
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case "tushumlar": return <TrendingUp className="w-5 h-5" />;
      case "chiqimlar": return <TrendingDown className="w-5 h-5" />;
      case "foyda": return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {t("finance_report")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {t("income_expense_profit")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {(["tushumlar", "chiqimlar", "foyda"] as Category[]).map((cat) => {
            const total = currentMonthData[cat].reduce((a, b) => a + b, 0);
            return (
              <div 
                key={cat} 
                className={`p-4 sm:p-5 rounded-xl border ${COLORS[cat].border} ${COLORS[cat].light} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {t(cat)}
                    </p>
                    <p className={`text-2xl sm:text-3xl font-bold ${COLORS[cat].text}`}>
                      {total} {t("mln")}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${darkMode ? COLORS[cat].gradientDark : COLORS[cat].gradient} text-white`}>
                    {getCategoryIcon(cat)}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("current_month")}: {currentMonthData[cat].length} {t("week")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {t(category)} {t("chart")}
              </h2>
              <div className="flex gap-2">
                {(["tushumlar", "chiqimlar", "foyda"] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      category === cat 
                        ? `bg-gradient-to-r ${darkMode ? COLORS[cat].gradientDark : COLORS[cat].gradient} text-white shadow-md`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t(cat)}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96">
              <Line data={chartData} options={lineChartOptions} />
            </div>
            <div className="flex gap-2 mt-4 sm:mt-6">
              {(["yillik", "oylik", "haftalik"] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    range === r 
                      ? 'bg-gray-800 dark:bg-gray-700 text-white shadow'
                      : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t(r)}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {t("current_month_income")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {t("by_weeks")}
                </p>
              </div>
            </div>
            <div className="w-full h-56 sm:h-64 md:h-72">
              <Doughnut data={pieChartData} options={pieChartOptions} />
            </div>
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("total")}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {currentMonthData[category].reduce((a, b) => a + b, 0)} {t("mln")}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("average")}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {(currentMonthData[category].reduce((a, b) => a + b, 0) / currentMonthData[category].length).toFixed(1)} {t("mln")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}