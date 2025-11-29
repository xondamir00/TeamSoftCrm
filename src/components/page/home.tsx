import { useState } from "react";
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

  const currentMonthData = {
    labels: ["1-hafta", "2-hafta", "3-hafta", "4-hafta"],
    tushumlar: [15, 18, 22, 25],
    chiqimlar: [8, 10, 12, 14],
    foyda: [7, 8, 10, 11],
  };

  const dataSets = {
    yillik: {
      labels: [
        "Yan",
        "Fev",
        "Mar",
        "Apr",
        "May",
        "Iyn",
        "Iyl",
        "Avg",
        "Sen",
        "Okt",
        "Noy",
        "Dek",
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
        borderColor:
          category === "tushumlar"
            ? "#10b981"
            : category === "chiqimlar"
            ? "#f59e0b"
            : "#3b82f6",
        backgroundColor:
          category === "tushumlar"
            ? "rgba(16, 185, 129, 0.1)"
            : category === "chiqimlar"
            ? "rgba(245, 158, 11, 0.1)"
            : "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor:
          category === "tushumlar"
            ? "#10b981"
            : category === "chiqimlar"
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
        label: "Hozirgi oy tushumlari",
        data: currentMonthData.tushumlar,
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
    labels: ["Ijara", "Reklama", "Maosh"],
    datasets: [
      {
        data: [200, 300, 250],
        backgroundColor: ["#f59e0b", "#ef4444", "#8b5cf6"],
        borderColor: ["#fff", "#fff", "#fff"],
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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderColor: "rgba(255, 255, 255, 0.2)",
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
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
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
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed} mln so'm`;
          },
        },
      },
    },
  };

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case "tushumlar":
        return "from-emerald-500 to-teal-600";
      case "chiqimlar":
        return "from-amber-500 to-orange-600";
      case "foyda":
        return "from-blue-500 to-indigo-600";
    }
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
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold dark:text-amber-50 text-slate-900">
            Moliyaviy Hisobot
          </h1>
          <p className=" dark:text-gray-500 text-slate-900 text-sm md:text-base">
            Tushumlar, chiqimlar va foydaning vizual ko'rinishi
          </p>
        </div>

        <div className="border-2   rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Statistik Ma'lumotlar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
              <span className="text-sm text-slate-700">O'rtacha tushum</span>
              <span className="font-bold text-emerald-700">14.2 mln</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
              <span className="text-sm text-slate-700">O'rtacha chiqim</span>
              <span className="font-bold text-amber-700">8.7 mln</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-sm text-slate-700">O'rtacha foyda</span>
              <span className="font-bold text-blue-700">5.5 mln</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border shadow-md rounded-2xl  p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {category === "tushumlar"
                    ? "Tushumlar"
                    : category === "chiqimlar"
                    ? "Chiqimlar"
                    : "Foyda"}{" "}
                  Diagrammasi
                </h2>
                <p className="text-sm mt-1">
                  {range === "yillik"
                    ? "Yillik"
                    : range === "oylik"
                    ? "Oylik"
                    : "Haftalik"}{" "}
                  ko'rinish
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl  ${getCategoryColor(
                  category
                )} text-white`}
              >
                {getCategoryIcon(category)}
              </div>
            </div>

            <div className="w-full h-[350px] md:h-[400px]">
              <Line data={chartData} options={lineChartOptions} />
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {(["yillik", "oylik", "haftalik"] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    range === r
                      ? "bg-white text-slate-700 hover:bg-slate-50 shadow"
                      : "bg-slate-900 text-white shadow-lg"
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

            <div
              className={`mt-6 p-4 rounded-xl bg-gradient-to-r ${getCategoryColor(
                category
              )} text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Jami miqdor</p>
                  <p className="text-3xl font-bold mt-1">
                    {totalAmount.toFixed(1)} mln
                  </p>
                </div>
                <DollarSign className="w-12 h-12 opacity-50" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-2 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">
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
                            ? `bg-gradient-to-r ${getCategoryColor(
                                cat
                              )} text-white shadow-lg`
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-700 font-medium">
                  Jami: {currentMonthData.tushumlar.reduce((a, b) => a + b, 0)}{" "}
                  mln so'm
                </p>
              </div>
            </div>

            {category === "chiqimlar" && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
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
