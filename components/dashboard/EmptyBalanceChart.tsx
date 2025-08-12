"use client";

import { Area, AreaChart, CartesianGrid } from "recharts";
import { ChartContainer } from "../ui/chart";

// Define the balance chart color as the primary color to match BalanceChart
const chartColor = "oklch(0.716 0.1739 155.45)";

// Static, slightly upward-trending random-walk data with realistic fluctuations
// Dates are ISO strings to work with the existing tick/label formatters
const staticChartData = (() => {
  // Deterministic PRNG (Mulberry32) to avoid hydration/rehydration mismatches
  function mulberry32(seed: number) {
    return function random() {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Build a sequence of daily ISO date strings
  function buildDailyDates(startISO: string, days: number) {
    const start = new Date(startISO);
    const result: string[] = [];
    for (let i = 0; i < days; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      result.push(d.toISOString().slice(0, 10));
    }
    return result;
  }

  // Parameters chosen to create a subtle upward trend with frequent small fluctuations
  const numDays = 31; // plenty of detail
  const dates = buildDailyDates("2024-01-01", numDays);

  // Keep values roughly within the 0..100 placeholder range for consistency
  const startingBalance = 18; // a modest starting point
  const expectedEndBalance = 100; // gentle climb by month end
  const deterministicSeed = 42;
  const rng = mulberry32(deterministicSeed);

  // Compute a per-day linear drift towards the expected end value
  const dailyDrift = (expectedEndBalance - startingBalance) / (numDays - 1);

  // Noise helpers
  const noiseAmplitude = 8; // typical day-to-day wiggle
  const shockEveryNDays = 9; // occasional dips like an expense or market wobble
  const shockMagnitude = 12; // dip size

  let running = startingBalance;
  const points = dates.map((date, index) => {
    // base drift upward
    running += dailyDrift;

    // day-to-day noise around zero
    const dailyNoise = (rng() - 0.5) * 2 * noiseAmplitude;
    running += dailyNoise;

    // occasional transient shocks with partial rebound the next day
    if (index > 0 && index % shockEveryNDays === 0) {
      running -= shockMagnitude * (0.8 + 0.4 * rng()); // stronger downward move
    } else if ((index + 1) % shockEveryNDays === 0) {
      running += shockMagnitude * 0.5 * (0.8 + 0.4 * rng()); // partial rebound
    }

    // Clamp to a sane range for the placeholder chart
    running = Math.max(0, Math.min(120, running));

    return { date, balance: Math.round(running) };
  });

  return points;
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
        <div className="text-sm text-muted-foreground py-2.5 px-5 bg-background rounded-md border border-border mb-8 shadow-xs">
          Add more transactions to see your balance chart.
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full blur-xs"
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
