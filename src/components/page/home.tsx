"use client";

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

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

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
      card: "bg-white dark:bg-gray-800"
    },
    text: {
      primary: "text-slate-900 dark:text-gray-100",
      muted: "text-slate-500 dark:text-gray-400",
      light: "text-white dark:text-gray-100"
    },
    border: {
      card: "border-gray-200 dark:border-gray-700"
    }
  };

  const dataSets = {
    yillik: {
      labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
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

  const currentMonthData = {
    labels: ["1-hafta", "2-hafta", "3-hafta", "4-hafta"],
    tushumlar: [15, 18, 22, 25],
    chiqimlar: [8, 10, 12, 14],
    foyda: [7, 8, 10, 11],
  };

  const selected = dataSets[range];
  const activeValues =
    category === "tushumlar" ? selected.tushumlar :
    category === "chiqimlar" ? selected.chiqimlar : selected.foyda;

  const chartData = {
    labels: selected.labels,
    datasets: [
      {
        label: category,
        data: activeValues,
        borderColor: darkMode ? COLORS[category].primaryDark : COLORS[category].primary,
        backgroundColor: darkMode ? `${COLORS[category].primaryDark}30` : `${COLORS[category].primary}30`,
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

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? "#1f2937" : "#000",
        titleColor: darkMode ? "#f3f4f6" : "#fff",
        bodyColor: darkMode ? "#d1d5db" : "#e5e7eb",
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y} mln so'm`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { color: darkMode ? "#9ca3af" : "#6b7280" } },
      y: { ticks: { color: darkMode ? "#9ca3af" : "#6b7280" } },
    },
  };

  const currentMonthChartData = {
    labels: currentMonthData.labels,
    datasets: [
      {
        label: "Hozirgi oy",
        data: currentMonthData[category],
        backgroundColor: [
          "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"
        ],
      },
    ],
  };

  const pieChartOptions = { responsive: true, maintainAspectRatio: false };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case "tushumlar": return <TrendingUp className="w-5 h-5" />;
      case "chiqimlar": return <TrendingDown className="w-5 h-5" />;
      case "foyda": return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-gray-100">Moliyaviy Hisobot</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-gray-400">Tushumlar, chiqimlar va foyda</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["tushumlar","chiqimlar","foyda"] as Category[]).map((cat) => (
            <div key={cat} className={`flex justify-between items-center p-4 rounded-lg border ${COLORS[cat].border} ${COLORS[cat].light}`}>
              <span className="text-sm text-slate-700 dark:text-gray-300">{cat}</span>
              <span className={`font-bold ${COLORS[cat].text}`}>{currentMonthData[cat].reduce((a,b)=>a+b,0)} mln</span>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 border rounded-2xl shadow-xl bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100">{category} Diagrammasi</h2>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${COLORS[category].gradient} text-white`}>{getCategoryIcon(category)}</div>
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(["tushumlar","chiqimlar","foyda"] as Category[]).map((cat) => (
                <button key={cat} onClick={()=>setCategory(cat)} className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${category===cat?'bg-blue-600 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{cat}</button>
              ))}
            </div>

            <div className="w-full h-72 md:h-96">
              <Line data={chartData} options={lineChartOptions}/>
            </div>

            {/* Range Buttons */}
            <div className="flex gap-2 mt-4">
              {(["yillik","oylik","haftalik"] as Range[]).map((r)=>(
                <button key={r} onClick={()=>setRange(r)} className={`px-3 py-2 rounded-lg ${range===r?'bg-gray-800 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{r}</button>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="p-6 border rounded-2xl shadow-xl bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400"/>
              <h3 className="font-bold text-slate-900 dark:text-gray-100">Hozirgi Oy Tushumlari</h3>
            </div>
            <div className="w-full h-72">
              <Doughnut data={currentMonthChartData} options={pieChartOptions}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
