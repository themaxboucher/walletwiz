"use client";

import { Area, AreaChart, CartesianGrid } from "recharts";
import { ChartContainer } from "../ui/chart";

// Define the balance chart color as the primary color to match BalanceChart
const chartColor = "oklch(0.716 0.1739 155.45)";

// Static, upward-trending S-shaped (cube root) data to display when there are too few real data points
// Dates are ISO strings to work with the existing tick/label formatters
const staticChartData = (() => {
  const dates = [
    "2024-01-01",
    "2024-01-05",
    "2024-01-10",
    "2024-01-15",
    "2024-01-20",
    "2024-01-25",
    "2024-01-31",
  ];
  const minBalance = 0;
  const maxBalance = 100;
  const numPoints = dates.length;

  return dates.map((date, index) => {
    const t01 = index / (numPoints - 1); // 0..1
    const x = 2 * t01 - 1; // -1..1
    const sCurve = Math.cbrt(x); // -1..1, S-shaped
    const y01 = (sCurve + 1) / 2; // 0..1
    const balance = Math.round(minBalance + y01 * (maxBalance - minBalance));
    return { date, balance };
  });
})();

export default function EmptyBalanceChart() {
  const chartConfig = {
    balance: {
      label: "Balance",
      color: chartColor,
    },
  } as const;

  return (
    <div className="relative pb-8 pl-8">
      <div className="absolute z-10 inset-0 flex justify-center items-center">
        <div className="text-sm text-muted-foreground py-2.5 px-5 bg-card rounded-md border border-border mb-6 shadow-xs">
          Too few transactions to show a balance chart.
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <AreaChart
          data={staticChartData}
          margin={{
            top: 3,
            right: 4,
            left: -18,
            bottom: 3,
          }}
        >
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="balance"
            stroke={chartColor}
            fill="url(#balanceGradient)"
            strokeWidth={2.5}
          />
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            className="stroke-border/50"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
