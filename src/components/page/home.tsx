import { useState, useEffect } from "react";
import { Line, Pie, Doughnut } from "react-chartjs-2";
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
import { TrendingUp, TrendingDown, DollarSign, PieChart, Moon, Sun } from "lucide-react";

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

export default function Home() {
  const [category, setCategory] = useState<Category>("tushumlar");
  const [range, setRange] = useState<Range>("yillik");
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode ni tekshirish
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Rang konstantalari (light va dark mode uchun)
  const COLORS = {
    tushumlar: {
      primary: "#10b981",
      primaryDark: "#059669",
      gradient: "from-emerald-500 to-teal-600",
      gradientDark: "from-emerald-600 to-teal-700",
      light: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800"
    },
    chiqimlar: {
      primary: "#f59e0b",
      primaryDark: "#d97706",
      gradient: "from-amber-500 to-orange-600",
      gradientDark: "from-amber-600 to-orange-700",
      light: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800"
    },
    foyda: {
      primary: "#3b82f6",
      primaryDark: "#2563eb",
      gradient: "from-blue-500 to-indigo-600",
      gradientDark: "from-blue-600 to-indigo-700",
      light: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800"
    },
    background: {
      light: "bg-gray-50 dark:bg-gray-900",
      white: "bg-white dark:bg-gray-800",
      dark: "bg-slate-900 dark:bg-gray-950",
      card: "bg-white dark:bg-gray-800"
    },
    text: {
      primary: "text-slate-900 dark:text-gray-100",
      secondary: "text-slate-700 dark:text-gray-300",
      muted: "text-slate-500 dark:text-gray-400",
      light: "text-white dark:text-gray-100"
    },
    border: {
      default: "border-slate-200 dark:border-gray-700",
      dark: "border-slate-300 dark:border-gray-600",
      card: "border-gray-200 dark:border-gray-700"
    },
    button: {
      active: "bg-slate-900 dark:bg-gray-700 text-white dark:text-gray-100",
      inactive: "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
    }
  };

  const currentMonthData = {
    labels: ["1-hafta", "2-hafta", "3-hafta", "4-hafta"],
    tushumlar: [15, 18, 22, 25],
    chiqimlar: [8, 10, 12, 14],
    foyda: [7, 8, 10, 11],
  };

  const dataSets = {
    yillik: {
      labels: [
        "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
        "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"
      ],
      tushumlar: [5, 6, 8, 9, 10, 11, 12, 13, 15, 17, 18, 20],
      chiqimlar: [3, 3.5, 4, 4.5, 5, 5.2, 6, 7, 8, 9, 10, 11],
      foyda: [2, 2.5, 4, 4.5, 5, 5.8, 6, 6.5, 7, 8, 8, 9],
    },
    oylik: {
      labels: ["1-hafta", "2-hafta", "3-hafta", "4-hafta"],
      tushumlar: [12, 14, 16, 18],
      chiqimlar: [4, 5, 6, 7],
      foyda: [8, 9, 10, 11],
    },
    haftalik: {
      labels: ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"],
      tushumlar: [3, 4, 3.5, 5, 6, 7, 6],
      chiqimlar: [1, 1.5, 2, 2.5, 3, 3, 2.5],
      foyda: [2, 2.5, 1.5, 2.5, 3, 4, 3.5],
    },
  };

  const selected = dataSets[range];

  const activeValues =
    category === "tushumlar"
      ? selected.tushumlar
      : category === "chiqimlar"
      ? selected.chiqimlar
      : selected.foyda;

  const totalAmount = activeValues.reduce((sum, v) => sum + v, 0);

  const chartData = {
    labels: selected.labels,
    datasets: [
      {
        label:
          category === "tushumlar"
            ? "Tushumlar"
            : category === "chiqimlar"
            ? "Chiqimlar"
            : "Foyda",
        data: activeValues,
        borderColor: darkMode ? COLORS[category].primaryDark : COLORS[category].primary,
        backgroundColor: darkMode 
          ? `${COLORS[category].primaryDark}20`
          : `${COLORS[category].primary}20`,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: darkMode ? COLORS[category].primaryDark : COLORS[category].primary,
        pointBorderColor: darkMode ? "#1f2937" : "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const currentMonthChartData = {
    labels: currentMonthData.labels,
    datasets: [
      {
        label: "Hozirgi oy tushumlari",
        data: currentMonthData.tushumlar,
        backgroundColor: darkMode
          ? [
              "rgba(16, 185, 129, 0.7)",
              "rgba(52, 211, 153, 0.7)",
              "rgba(110, 231, 183, 0.7)",
              "rgba(167, 243, 208, 0.7)",
            ]
          : [
              "rgba(16, 185, 129, 0.8)",
              "rgba(52, 211, 153, 0.8)",
              "rgba(110, 231, 183, 0.8)",
              "rgba(167, 243, 208, 0.8)",
            ],
        borderColor: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
        borderWidth: 2,
      },
    ],
  };

  const chiqimDetails = {
    labels: ["Ijara", "Reklama", "Maosh"],
    datasets: [
      {
        data: [200, 300, 250],
        backgroundColor: darkMode
          ? ["rgba(245, 158, 11, 0.8)", "rgba(239, 68, 68, 0.8)", "rgba(139, 92, 246, 0.8)"]
          : ["#f59e0b", "#ef4444", "#8b5cf6"],
        borderColor: darkMode ? ["#1f2937", "#1f2937", "#1f2937"] : ["#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: darkMode ? "rgba(31, 41, 55, 0.9)" : "rgba(0, 0, 0, 0.8)",
        titleColor: darkMode ? "#f3f4f6" : "#ffffff",
        bodyColor: darkMode ? "#d1d5db" : "#e5e7eb",
        borderColor: darkMode ? "rgba(75, 85, 99, 0.5)" : "rgba(255, 255, 255, 0.2)",
        padding: 12,
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y} mln so'm`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : undefined,
        },
        ticks: {
          color: darkMode ? "#9ca3af" : "#6b7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: darkMode ? "#9ca3af" : "#6b7280",
          font: {
            size: 12,
          },
          callback: function (value: any) {
            return value + " mln";
          },
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: darkMode ? "#d1d5db" : "#374151",
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "rgba(31, 41, 55, 0.9)" : "rgba(0, 0, 0, 0.8)",
        titleColor: darkMode ? "#f3f4f6" : "#ffffff",
        bodyColor: darkMode ? "#d1d5db" : "#e5e7eb",
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed} mln so'm`;
          },
        },
      },
    },
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case "tushumlar":
        return <TrendingUp className="w-6 h-6" />;
      case "chiqimlar":
        return <TrendingDown className="w-6 h-6" />;
      case "foyda":
        return <DollarSign className="w-6 h-6" />;
    }
  };

  return (
    <div className={`min-h-screen  bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 p-4 md:p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Sarlavha va dark mode toggle */}
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2 flex-1">
            <h1 className={`text-3xl md:text-4xl font-bold ${COLORS.text.primary}`}>
              Moliyaviy Hisobot
            </h1>
            <p className={`${COLORS.text.muted} text-sm md:text-base`}>
              Tushumlar, chiqimlar va foydaning vizual ko'rinishi
            </p>
          </div>
       
        </div>

        {/* Statistik ma'lumotlar */}
        <div className={`border-2 ${COLORS.border.card} rounded-2xl shadow-xl p-6 ${COLORS.background.card} transition-colors duration-300`}>
          <h3 className={`text-lg font-bold ${COLORS.text.primary} mb-6`}>
            Statistik Ma'lumotlar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`flex justify-between items-center p-4 ${COLORS.tushumlar.light} rounded-lg border ${COLORS.tushumlar.border} transition-colors duration-300`}>
              <span className={`text-sm ${COLORS.text.secondary}`}>O'rtacha tushum</span>
              <span className={`font-bold ${COLORS.tushumlar.text}`}>14.2 mln</span>
            </div>
            <div className={`flex justify-between items-center p-4 ${COLORS.chiqimlar.light} rounded-lg border ${COLORS.chiqimlar.border} transition-colors duration-300`}>
              <span className={`text-sm ${COLORS.text.secondary}`}>O'rtacha chiqim</span>
              <span className={`font-bold ${COLORS.chiqimlar.text}`}>8.7 mln</span>
            </div>
            <div className={`flex justify-between items-center p-4 ${COLORS.foyda.light} rounded-lg border ${COLORS.foyda.border} transition-colors duration-300`}>
              <span className={`text-sm ${COLORS.text.secondary}`}>O'rtacha foyda</span>
              <span className={`font-bold ${COLORS.foyda.text}`}>5.5 mln</span>
            </div>
          </div>
        </div>

        {/* Asosiy kontent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chap tomon - Asosiy diagramma */}
          <div className="lg:col-span-2 border shadow-md rounded-2xl p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-bold ${COLORS.text.primary}`}>
                  {category === "tushumlar"
                    ? "Tushumlar"
                    : category === "chiqimlar"
                    ? "Chiqimlar"
                    : "Foyda"}{" "}
                  Diagrammasi
                </h2>
                <p className={`text-sm mt-1 ${COLORS.text.muted}`}>
                  {range === "yillik"
                    ? "Yillik"
                    : range === "oylik"
                    ? "Oylik"
                    : "Haftalik"}{" "}
                  ko'rinish
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${
                  darkMode ? COLORS[category].gradientDark : COLORS[category].gradient
                } ${COLORS.text.light} transition-colors duration-300`}
              >
                {getCategoryIcon(category)}
              </div>
            </div>

            {/* Kategoriya tugmalari (tushumlar diagrammasi uchun) */}
            <div className="flex flex-wrap gap-3 mb-6">
              {(["tushumlar", "chiqimlar", "foyda"] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    category === cat
                      ? `bg-gradient-to-r ${
                          darkMode ? COLORS[cat].gradientDark : COLORS[cat].gradient
                        } ${COLORS.text.light} shadow-lg`
                      : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
                  }`}
                >
                  {getCategoryIcon(cat)}
                  <span>
                    {cat === "tushumlar"
                      ? "Tushumlar"
                      : cat === "chiqimlar"
                      ? "Chiqimlar"
                      : "Foyda"}
                  </span>
                </button>
              ))}
            </div>

            <div className="w-full h-[300px] md:h-[350px]">
              <Line data={chartData} options={lineChartOptions} />
            </div>

            {/* Vaqt oralig'i tugmalari */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {(["yillik", "oylik", "haftalik"] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    range === r
                      ? "bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 hover:bg-gray-900 dark:hover:bg-gray-600 shadow border border-gray-300 dark:border-gray-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-lg"
                  }`}
                >
                  {r === "yillik"
                    ? "Yillik"
                    : r === "oylik"
                    ? "Oylik"
                    : "Haftalik"}
                </button>
              ))}
            </div>

            {/* Jami miqdor paneli */}
         
          </div>

          {/* O'ng tomon - Yon panel */}
          <div className="space-y-6">
            {/* Hozirgi oy tushumlari */}
            <div className={`border-2 ${COLORS.border.card} rounded-2xl shadow-xl p-6 ${COLORS.background.card} transition-colors duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className={`text-lg font-bold ${COLORS.text.primary}`}>
                    Hozirgi Oy Tushumlari
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {(["tushumlar", "chiqimlar", "foyda"] as Category[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`p-2.5 rounded-lg transition-all duration-300 ${
                          category === cat
                            ? `bg-gradient-to-r ${
                                darkMode ? COLORS[cat].gradientDark : COLORS[cat].gradient
                              } ${COLORS.text.light} shadow-lg`
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                        title={
                          cat === "tushumlar"
                            ? "Tushumlar"
                            : cat === "chiqimlar"
                            ? "Chiqimlar"
                            : "Foyda"
                        }
                      >
                        {getCategoryIcon(cat)}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="w-full h-[220px]">
                <Doughnut
                  data={currentMonthChartData}
                  options={pieChartOptions}
                />
              </div>
              <div className={`mt-4 p-4 ${COLORS.tushumlar.light} rounded-lg border ${COLORS.tushumlar.border} transition-colors duration-300`}>
                <p className={`text-sm ${COLORS.tushumlar.text} font-medium`}>
                  Jami: {currentMonthData.tushumlar.reduce((a, b) => a + b, 0)}{" "}
                  mln so'm
                </p>
              </div>
            </div>

            {/* Chiqimlar turlari (faqat chiqimlar tanlanganida) */}
            {category === "chiqimlar" && (
              <div className={`border ${COLORS.border.card} rounded-2xl shadow-xl p-6 ${COLORS.background.card} transition-colors duration-300`}>
                <h3 className={`text-lg font-bold ${COLORS.text.primary} mb-4`}>
                  Chiqimlar Turlari
                </h3>
                <div className="w-full h-[220px]">
                  <Pie data={chiqimDetails} options={pieChartOptions} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}