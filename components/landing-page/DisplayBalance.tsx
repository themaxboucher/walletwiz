"use client";

import BalanceChart from "../dashboard/BalanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatCurrency } from "@/lib/utils";
import { ChartContainer } from "../ui/chart";
import { Area, AreaChart } from "recharts";

export default function DisplayBalance() {
  const totalBalance = 7699.32;

  const chartData = [
    { date: "2025-06-01", balance: 2600 },
    { date: "2025-06-02", balance: 3320 },
    { date: "2025-06-03", balance: 3640 },
    { date: "2025-06-04", balance: 4755 },
    { date: "2025-06-05", balance: 5370 },
    { date: "2025-06-06", balance: 7385 },
    { date: "2025-06-07", balance: 7699.32 },
  ];

  const chartConfig = {
    balance: {
      label: "Balance",
      color: "oklch(0.6635 0.1608 155.21)",
    },
  };

  return (
    <Card className="text-left absolute top-10 left-10 -right-8">
      <CardHeader>
        <CardTitle className="text-muted-foreground">Balance</CardTitle>
        <p className="text-3xl tracking-tight font-semibold">
          {formatCurrency(totalBalance)}
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[225px] w-full -translate-y-10"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 3, right: 4, left: -18, bottom: 3 }}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="oklch(0.6635 0.1608 155.21)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="oklch(0.6635 0.1608 155.21)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="balance"
              stroke="oklch(0.6635 0.1608 155.21)"
              fill="url(#balanceGradient)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
