"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { abbreviateNumber, formatCurrency } from "@/lib/utils";

interface BalanceChartProps {
  transactions: Transaction[];
}

export default function BalanceChart({ transactions }: BalanceChartProps) {
  const chartData = useMemo(() => {
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate running balance
    let balance = 0;
    return sortedTransactions.map((tx) => {
      balance += tx.amount;
      return {
        date: new Date(tx.date).toLocaleDateString(),
        balance,
      };
    });
  }, [transactions]);

  const chartConfig = {
    balance: {
      label: "Balance",
      color: "oklch(0.6635 0.1608 155.21)",
    },
  };

  console.log(chartData);

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <AreaChart
        data={chartData}
        margin={{ top: 0, right: 0, left: -18, bottom: 0 }}
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
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          className="stroke-border/50"
        />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          minTickGap={32}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => abbreviateNumber(value).toUpperCase()}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
              }}
              formatter={(value) => formatCurrency(value as number)}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="oklch(0.6635 0.1608 155.21)"
          fill="url(#balanceGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
