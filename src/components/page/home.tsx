"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pie, Line } from "react-chartjs-2";
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

type ChartType = "tushumlar" | "chiqimlar" | "foyda";

export default function FinancePage() {
  const [active, setActive] = useState<ChartType>("tushumlar");

  const pieData = {
    tushumlar: {
      labels: ["Kurslar", "Kitoblar", "Boshqa"],
      datasets: [
        {
          data: [400, 150, 100],
          backgroundColor: ["#22c55e", "#3b82f6", "#f97316"],
        },
      ],
    },
    chiqimlar: {
      labels: ["Ijara", "Reklama", "Maosh"],
      datasets: [
        {
          data: [200, 300, 250],
          backgroundColor: ["#ef4444", "#eab308", "#3b82f6"],
        },
      ],
    },
    foyda: {
      labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"],
      datasets: [
        {
          label: "Foyda (so‘m)",
          data: [5, 6, 7.5, 8, 9.2, 10],
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.2)",
          tension: 0.4,
        },
      ],
    },
  };

  const lineData = {
    labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"],
    datasets: [
      {
        label:
          active === "tushumlar"
            ? "Tushumlar (so‘m)"
            : active === "chiqimlar"
            ? "Chiqimlar (so‘m)"
            : "Foyda (so‘m)",
        data:
          active === "tushumlar"
            ? [5, 6.5, 7, 8, 9.5, 10]
            : active === "chiqimlar"
            ? [3, 3.5, 4.5, 5, 6, 6.5]
            : [2, 3, 4, 5, 5.5, 6],
        borderColor:
          active === "tushumlar"
            ? "#3b82f6"
            : active === "chiqimlar"
            ? "#ef4444"
            : "#22c55e",
        backgroundColor:
          active === "tushumlar"
            ? "rgba(59,130,246,0.2)"
            : active === "chiqimlar"
            ? "rgba(239,68,68,0.2)"
            : "rgba(34,197,94,0.2)",
        tension: 0.4,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#374151" },
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "#374151" },
      },
    },
  };

  return (
    <div className="min-h-screen  dark:text-white p-6">
      <div className="border  p-4 rounded-md ">
        <div className="flex justify-center gap-6 py-6">
          <Button
            className="w-[200px] h-[50px]"
            variant={active === "tushumlar" ? "default" : "outline"}
            onClick={() => setActive("tushumlar")}
          >
            Tushumlar
          </Button>

          <Button
            className="w-[200px] h-[50px]"
            variant={active === "chiqimlar" ? "default" : "outline"}
            onClick={() => setActive("chiqimlar")}
          >
            Chiqimlar
          </Button>

          <Button
            className="w-[200px] h-[50px]"
            variant={active === "foyda" ? "default" : "outline"}
            onClick={() => setActive("foyda")}
          >
            Foyda
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <Card className=" text-center h-[500px] flex flex-col justify-between">
            <CardHeader>
              <CardTitle>
                {active === "tushumlar"
                  ? "Tushumlar diagrammasi (shu oy)"
                  : active === "chiqimlar"
                  ? "Chiqimlar diagrammasi (shu oy)"
                  : "Foyda (oylar bo‘yicha)"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-1">
              <div className="w-[400px] h-[400px]">
                {active === "foyda" ? (
                  <Line data={pieData.foyda} options={commonOptions} />
                ) : (
                  <Pie
                    data={
                      active === "tushumlar"
                        ? pieData.tushumlar
                        : pieData.chiqimlar
                    }
                    options={commonOptions}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className=" text-center h-[500px] flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Diagramma oylar bo‘yicha</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-1">
              <div className="w-[400px] h-[400px]">
                <Line data={lineData} options={commonOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
