"use client";

import Greeting from "./Greeting";
import { Separator } from "../ui/separator";
import Transactions from "./Transactions";
import Balance from "./Balance";
import { Card, CardHeader, CardTitle } from "../ui/card";
import AmountCard from "./AmountCard";
import TimeRangeSelector from "./TimeRangeSelector";
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { percentageChange } from "@/lib/utils";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

interface DashboardContentProps {
  user: {
    firstName: string;
  };
  transactions: Transaction[];
}

export default function DashboardContent({
  user,
  transactions,
}: DashboardContentProps) {
  // State for date range
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return transactions;

    const from = dateRange.from as Date;
    const to = dateRange.to as Date;

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= from && txDate <= to;
    });
  }, [transactions, dateRange]);

  console.log(filteredTransactions);

  // Generate balance chart data for all transactions
  const allChartData = useMemo(() => {
    // Early return if there are no transactions
    if (transactions.length === 0) return [];

    // Sort all transactions by date in ascending order
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate running balance for each date
    let balance = 0; // Start with 0 balance
    let txIndex = 0; // Start with first transaction

    // Create data points for each day in the selected range
    const dates: Date[] = [];
    const from = dateRange?.from || new Date(sortedTransactions[0].date);
    const to =
      dateRange?.to ||
      new Date(sortedTransactions[sortedTransactions.length - 1].date);

    const currentDate = new Date(from);
    while (currentDate <= to) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates.map((date) => {
      // For each date, add any transactions that occurred on or before this date
      while (
        txIndex < sortedTransactions.length &&
        new Date(sortedTransactions[txIndex].date) <= date
      ) {
        balance += sortedTransactions[txIndex].amount;
        txIndex++;
      }
      // Return a data point with the date and running balance
      return {
        date: date.toISOString(),
        balance,
      };
    });
  }, [transactions, dateRange]); // Recalculate when transactions or date range changes

  // Filter chart data based on selected date range
  const filteredChartData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return allChartData;

    const from = dateRange.from as Date;
    const to = dateRange.to as Date;

    return allChartData.filter((point) => {
      const pointDate = new Date(point.date);
      return pointDate >= from && pointDate <= to;
    });
  }, [allChartData, dateRange]);

  // Calculate totals from filtered transactions
  const income = filteredTransactions
    .filter((tx: Transaction) => tx.amount > 0)
    .reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);

  const expenses = filteredTransactions
    .filter((tx: Transaction) => tx.amount < 0)
    .reduce((sum: number, tx: Transaction) => sum + Math.abs(tx.amount), 0);

  const netChange = income - expenses;

  // Calculate total balance from all transactions up to today
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  const totalBalance = transactions
    .filter((tx) => new Date(tx.date) <= today)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate previous period metrics for comparison
  const { previousIncome, previousExpenses, previousNetChange } =
    useMemo(() => {
      // Return zeros if date range is not defined to prevent errors
      if (!dateRange?.from || !dateRange?.to)
        return { previousIncome: 0, previousExpenses: 0, previousNetChange: 0 };

      const currentPeriodStart = dateRange.from as Date;
      const currentPeriodEnd = dateRange.to as Date;

      // Calculate the duration of the current selected period
      const durationMs =
        currentPeriodEnd.getTime() - currentPeriodStart.getTime();

      // Determine the end date of the previous period (one day before current period starts)
      const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1);
      // Determine the start date of the previous period by subtracting the duration
      const previousPeriodStart = new Date(
        previousPeriodEnd.getTime() - durationMs
      );

      // Filter transactions that fall within the previous period
      const previousPeriodTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.date);
        return txDate >= previousPeriodStart && txDate <= previousPeriodEnd;
      });

      // Calculate income for the previous period
      const prevIncome = previousPeriodTransactions
        .filter((tx: Transaction) => tx.amount > 0)
        .reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);

      // Calculate expenses for the previous period
      const prevExpenses = previousPeriodTransactions
        .filter((tx: Transaction) => tx.amount < 0)
        .reduce((sum: number, tx: Transaction) => sum + Math.abs(tx.amount), 0);

      // Calculate net change for the previous period
      const prevNetChange = prevIncome - prevExpenses;

      return {
        previousIncome: prevIncome,
        previousExpenses: prevExpenses,
        previousNetChange: prevNetChange,
      };
    }, [transactions, dateRange]); // Recalculate when transactions or date range changes

  // Calculate percentage changes for income, expenses, and net change
  const incomePercentageChange = percentageChange(income, previousIncome);
  const expensesPercentageChange = percentageChange(expenses, previousExpenses);
  const savedPercentageChange = percentageChange(netChange, previousNetChange);

  // Calculate period text for AmountCard tooltip
  const periodText = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return "period";

    const start = dateRange.from;
    const end = dateRange.to;

    const totalDaysIncludingStart = differenceInDays(end, start); // Include both start and end days

    if (totalDaysIncludingStart === 7) return "week";
    if (totalDaysIncludingStart === 30 || totalDaysIncludingStart === 31)
      return "month";
    if (totalDaysIncludingStart === 365 || totalDaysIncludingStart === 366)
      return "year";

    // Default to days
    if (totalDaysIncludingStart === 1) return "day";
    return `${totalDaysIncludingStart} days`;
  }, [dateRange]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold md:text-2xl">
          <Greeting />, {user.firstName}
        </h1>
        <TimeRangeSelector
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          transactions={transactions}
        />
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-5">
        <div className="grid grid-cols-1 gap-5 col-span-2">
          <div className="grid grid-cols-3 gap-5">
            <AmountCard
              title="Income"
              amount={income}
              percentageChange={incomePercentageChange}
              periodText={periodText}
            />
            <AmountCard
              title="Expenses"
              amount={expenses}
              percentageChange={expensesPercentageChange}
              periodText={periodText}
            />
            <AmountCard
              title="Saved"
              amount={netChange}
              percentageChange={savedPercentageChange}
              periodText={periodText}
            />
          </div>
          <Balance totalBalance={totalBalance} chartData={filteredChartData} />
          <Transactions transactions={filteredTransactions} />
        </div>
        <div className="grid grid-cols-1 gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Connect an account</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}
