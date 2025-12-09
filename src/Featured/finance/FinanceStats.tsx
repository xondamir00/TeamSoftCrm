import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FinanceStatsProps } from "@/Store/Finanace/FinanceInterface";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function FinanceStatss({
  stats,
  loading = false,
}: FinanceStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="glass-card animate-pulse h-[120px]" />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Daromad",
      value: stats.totalIncome,
      color: "text-green-500",
      bg: "dark:from-green-500/20 shadow border p-4   dark:to-green-500/5",
      icon: <TrendingUp className="h-5 w-5  text-green-500 drop-shadow" />,
    },
    {
      title: "Chiqim",
      value: stats.totalExpense,
      color: "text-red-500",
      bg: "dark:from-red-500/20 shadow border p-4   dark:to-red-500/5",
      icon: <TrendingDown className="h-5 w-5 text-red-500 drop-shadow" />,
    },
    {
      title: "Foyda",
      value: stats.profit,
      color: stats.profit >= 0 ? "text-green-500" : "text-red-500",
      bg:
        stats.profit >= 0
          ? "dark:from-green-500/20 p-4 dark:to-green-500/5"
          : "dark:from-red-500/20 p-4 dark:to-red-500/5",
      icon: <DollarSign className="h-5 w-5 text-blue-500 drop-shadow" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <Card
          key={i}
          className={`
            group relative overflow-hidden rounded-2xl border backdrop-blur-xl
            bg-gradient-to-br ${item.bg}
            shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)]
            hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)]
            transition-all duration-300
          `}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              {item.title}
            </CardTitle>
            <div className="group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${item.color}`}>
              {item.value.toLocaleString()} soʻm
            </div>
          </CardContent>

          {/* Border Gradient Animation */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </Card>
      ))}
    </div>
  );
}
