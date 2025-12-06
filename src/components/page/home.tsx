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
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
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

type Category = "income" | "expenses" | "profit";
type Range = "yearly" | "monthly" | "weekly";

export default function FinancialDashboard() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<Category>("income");
  const [range, setRange] = useState<Range>("yearly");

  const currentMonthData = {
    labels: [
      t("financialDashboard.weeks.week1") || "1-hafta",
      t("financialDashboard.weeks.week2") || "2-hafta",
      t("financialDashboard.weeks.week3") || "3-hafta",
      t("financialDashboard.weeks.week4") || "4-hafta"
    ],
    income: [15, 18, 22, 25],
    expenses: [8, 10, 12, 14],
    profit: [7, 8, 10, 11],
  };

  const dataSets = {
    yearly: {
      labels: [
        t("financialDashboard.months.jan") || "Yan",
        t("financialDashboard.months.feb") || "Fev",
        t("financialDashboard.months.mar") || "Mar",
        t("financialDashboard.months.apr") || "Apr",
        t("financialDashboard.months.may") || "May",
        t("financialDashboard.months.jun") || "Iyn",
        t("financialDashboard.months.jul") || "Iyl",
        t("financialDashboard.months.aug") || "Avg",
        t("financialDashboard.months.sep") || "Sen",
        t("financialDashboard.months.oct") || "Okt",
        t("financialDashboard.months.nov") || "Noy",
        t("financialDashboard.months.dec") || "Dek",
      ],
      income: [5, 6, 8, 9, 10, 11, 12, 13, 15, 17, 18, 20],
      expenses: [3, 3.5, 4, 4.5, 5, 5.2, 6, 7, 8, 9, 10, 11],
      profit: [2, 2.5, 4, 4.5, 5, 5.8, 6, 6.5, 7, 8, 8, 9],
    },
    monthly: {
      labels: [
        t("financialDashboard.weeks.week1") || "1-hafta",
        t("financialDashboard.weeks.week2") || "2-hafta",
        t("financialDashboard.weeks.week3") || "3-hafta",
        t("financialDashboard.weeks.week4") || "4-hafta"
      ],
      income: [12, 14, 16, 18],
      expenses: [4, 5, 6, 7],
      profit: [8, 9, 10, 11],
    },
    weekly: {
      labels: [
        t("financialDashboard.days.mon") || "Du",
        t("financialDashboard.days.tue") || "Se",
        t("financialDashboard.days.wed") || "Cho",
        t("financialDashboard.days.thu") || "Pa",
        t("financialDashboard.days.fri") || "Ju",
        t("financialDashboard.days.sat") || "Sha",
        t("financialDashboard.days.sun") || "Ya"
      ],
      income: [3, 4, 3.5, 5, 6, 7, 6],
      expenses: [1, 1.5, 2, 2.5, 3, 3, 2.5],
      profit: [2, 2.5, 1.5, 2.5, 3, 4, 3.5],
    },
  };

  const selected = dataSets[range];

  const activeValues =
    category === "income"
      ? selected.income
      : category === "expenses"
      ? selected.expenses
      : selected.profit;

  const totalAmount = activeValues.reduce((sum, v) => sum + v, 0);

  const chartData = {
    labels: selected.labels,
    datasets: [
      {
        label: 
          category === "income"
            ? t("financialDashboard.income") || "Tushumlar"
            : category === "expenses"
            ? t("financialDashboard.expenses") || "Chiqimlar"
            : t("financialDashboard.profit") || "Foyda",
        data: activeValues,
        borderColor:
          category === "income"
            ? "#10b981"
            : category === "expenses"
            ? "#f59e0b"
            : "#3b82f6",
        backgroundColor:
          category === "income"
            ? "rgba(16, 185, 129, 0.1)"
            : category === "expenses"
            ? "rgba(245, 158, 11, 0.1)"
            : "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor:
          category === "income"
            ? "#10b981"
            : category === "expenses"
            ? "#f59e0b"
            : "#3b82f6",
        pointBorderColor: "#fff",
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
        label: t("financialDashboard.currentMonthIncome") || "Hozirgi oy tushumlari",
        data: currentMonthData.income,
        backgroundColor: [
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
    labels: [
      t("financialDashboard.expenseCategories.rent") || "Ijara",
      t("financialDashboard.expenseCategories.advertising") || "Reklama",
      t("financialDashboard.expenseCategories.salary") || "Maosh"
    ],
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
            return `${context.parsed.y} ${t("financialDashboard.currency") || "mln so'm"}`;
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
          callback: function (value: string | number) {
            if (typeof value === "number") {
              return value + " mln";
            }
            return value;
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
            return `${context.label}: ${context.parsed} ${t("financialDashboard.currency") || "mln so'm"}`;
          },
        },
      },
    },
  };

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case "income":
        return "from-emerald-500 to-teal-600";
      case "expenses":
        return "from-amber-500 to-orange-600";
      case "profit":
        return "from-blue-500 to-indigo-600";
    }
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case "income":
        return <TrendingUp className="w-6 h-6" />;
      case "expenses":
        return <TrendingDown className="w-6 h-6" />;
      case "profit":
        return <DollarSign className="w-6 h-6" />;
    }
  };

  const getCategoryLabel = (cat: Category): string => {
    switch (cat) {
      case "income":
        return t("financialDashboard.income");
      case "expenses":
        return t("financialDashboard.expenses") || "Chiqimlar";
      case "profit":
        return t("financialDashboard.profit") || "Foyda";
    }
  };

  const getRangeLabel = (r: Range): string => {
    switch (r) {
      case "yearly":
        return t("financialDashboard.yearly") || "Yillik";
      case "monthly":
        return t("financialDashboard.monthly") || "Oylik";
      case "weekly":
        return t("financialDashboard.weekly") || "Haftalik";
    }
  };

  const getCategoryKey = (cat: Category): string => {
    switch (cat) {
      case "income":
        return "tushumlar";
      case "expenses":
        return "chiqimlar";
      case "profit":
        return "foyda";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold dark:text-amber-50 text-slate-900">
            {t("financialDashboard.title") || "Moliyaviy Hisobot"}
          </h1>
          <p className="dark:text-gray-500 text-slate-900 text-sm md:text-base">
            {t("financialDashboard.subtitle") || "Tushumlar, chiqimlar va foydaning vizual ko'rinishi"}
          </p>
        </div>

        <div className="border-2 rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            {t("financialDashboard.statistics") || "Statistik Ma'lumotlar"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
              <span className="text-sm text-slate-700">
                {t("financialDashboard.averageIncome") || "O'rtacha tushum"}
              </span>
              <span className="font-bold text-emerald-700">14.2 {t("financialDashboard.currency")?.split(" ")[0] || "mln"}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
              <span className="text-sm text-slate-700">
                {t("financialDashboard.averageExpense") || "O'rtacha chiqim"}
              </span>
              <span className="font-bold text-amber-700">8.7 {t("financialDashboard.currency")?.split(" ")[0] || "mln"}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-sm text-slate-700">
                {t("financialDashboard.averageProfit") || "O'rtacha foyda"}
              </span>
              <span className="font-bold text-blue-700">5.5 {t("financialDashboard.currency")?.split(" ")[0] || "mln"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border shadow-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {getCategoryLabel(category)} {t("financialDashboard.diagram") || "Diagrammasi"}
                </h2>
                <p className="text-sm mt-1">
                  {getRangeLabel(range)} {t("financialDashboard.view") || "ko'rinish"}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${getCategoryColor(
                  category
                )} text-white`}
              >
                {getCategoryIcon(category)}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              {(["tushumlar", "chiqimlar", "foyda"] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    category === cat
                      ? `bg-gradient-to-r ${darkMode ? COLORS[cat].gradientDark : COLORS[cat].gradient} ${COLORS.text.light} shadow-lg`
                      : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`
                  }`}
                >
                  {getCategoryIcon(cat)}
                  <span>
                    {cat === "tushumlar" ? "Tushumlar" : cat === "chiqimlar" ? "Chiqimlar" : "Foyda"}
                  </span>
                </button>
              ))}
            </div>

            <div className="w-full h-[300px] md:h-[350px]">
              <Line data={chartData} options={lineChartOptions} />
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {(["yearly", "monthly", "weekly"] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    range === r
                      ? "bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 hover:bg-gray-900 dark:hover:bg-gray-600 shadow border border-gray-300 dark:border-gray-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-lg"
                  }`}
                >
                  {getRangeLabel(r)}
                </button>
              ))}
            </div>

            <div
              className={`mt-6 p-4 rounded-xl bg-gradient-to-r ${getCategoryColor(
                category
              )} text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">
                    {t("financialDashboard.totalAmount") || "Jami miqdor"}
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {totalAmount.toFixed(1)} {t("financialDashboard.currency")?.split(" ")[0] || "mln"}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 opacity-50" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`border-2 ${COLORS.border.card} rounded-2xl shadow-xl p-6 ${COLORS.background.card} transition-colors duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {t("financialDashboard.currentMonthIncome") || "Hozirgi Oy Tushumlari"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {(["income", "expenses", "profit"] as Category[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`p-2.5 rounded-lg transition-all duration-300 ${
                          category === cat
                            ? `bg-gradient-to-r ${getCategoryColor(
                                cat
                              )} text-white shadow-lg`
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                        title={getCategoryLabel(cat)}
                      >
                        {getCategoryIcon(cat)}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="w-full h-[220px]">
                <Doughnut data={currentMonthChartData} options={pieChartOptions} />
              </div>
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-700 font-medium">
                  {t("financialDashboard.total") || "Jami"}: {currentMonthData.income.reduce((a, b) => a + b, 0)} {t("financialDashboard.currency") || "mln so'm"}
                </p>
              </div>
            </div>

            {category === "expenses" && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {t("financialDashboard.expenseTypes") || "Chiqimlar Turlari"}
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