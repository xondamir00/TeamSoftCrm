"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

type Category = "tushumlar" | "chiqimlar" | "foyda";
type Range = "yillik" | "oylik" | "haftalik";

export default function FinancePage() {
  const [category, setCategory] = useState<Category>("tushumlar");
  const [range, setRange] = useState<Range>("yillik");

  const dataSets = {
    yillik: {
      labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
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
      labels: ["Du", "Se", "Chor", "Pay", "Ju", "Shan", "Yak"],
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
            ? "#3b82f6"
            : category === "chiqimlar"
            ? "#ef4444"
            : "#22c55e",
        backgroundColor:
          category === "tushumlar"
            ? "rgba(59,130,246,0.3)"
            : category === "chiqimlar"
            ? "rgba(239,68,68,0.3)"
            : "rgba(34,197,94,0.3)",
        tension: 0.4,
      },
    ],
  };

  const chiqimDetails = {
    labels: ["Ijara", "Reklama", "Maosh"],
    datasets: [
      {
        data: [200, 300, 250],
        backgroundColor: ["#ef4444", "#eab308", "#3b82f6"],
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 dark:text-white">
      {/* Category tanlash */}
      <div className="flex justify-center gap-4 mb-6">
        <Button variant={category === "tushumlar" ? "default" : "outline"} onClick={() => setCategory("tushumlar")} className="w-[150px]">
          Tushumlar
        </Button>
        <Button variant={category === "chiqimlar" ? "default" : "outline"} onClick={() => setCategory("chiqimlar")} className="w-[150px]">
          Chiqimlar
        </Button>
        <Button variant={category === "foyda" ? "default" : "outline"} onClick={() => setCategory("foyda")} className="w-[150px]">
          Foyda
        </Button>
      </div>

      {/* Vaqt filtri */}
      <div className="flex justify-center gap-4 mb-8">
        <Button variant={range === "yillik" ? "default" : "outline"} onClick={() => setRange("yillik")}>
          Yillik
        </Button>
        <Button variant={range === "oylik" ? "default" : "outline"} onClick={() => setRange("oylik")}>
          Oylik
        </Button>
        <Button variant={range === "haftalik" ? "default" : "outline"} onClick={() => setRange("haftalik")}>
          Haftalik
        </Button>
      </div>

      {/* Bitta asosiy diagramma */}
      <Card className="text-center p-4">
        <CardHeader>
          <CardTitle className="text-xl">
            {
              {
                tushumlar: "Tushumlar",
                chiqimlar: "Chiqimlar",
                foyda: "Foyda",
              }[category]
            }{" "}
            ({range})
          </CardTitle>
        </CardHeader>

        <CardContent className="w-[95%] mx-auto h-[420px]">
          <Line data={chartData} />
        </CardContent>

        {/* Jami miqdor */}
        <div className="py-4 text-lg font-semibold text-center">
          Jami: <span className="text-primary text-2xl">{totalAmount} mln so‘m</span>
        </div>
      </Card>

      {/* Chiqimlar breakdown */}
      {category === "chiqimlar" && (
        <Card className="mt-6 p-4">
          <CardHeader>
            <CardTitle>Chiqim turlari bo‘yicha</CardTitle>
          </CardHeader>
          <CardContent className="w-[300px] mx-auto">
            <Pie data={chiqimDetails} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
