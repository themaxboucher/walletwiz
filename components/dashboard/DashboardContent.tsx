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
      // Add any transactions that occurred on or before this date
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
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expenses = filteredTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const netChange = income - expenses;

  // Calculate total balance from all transactions up to today
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  const totalBalance = transactions
    .filter((tx) => new Date(tx.date) <= today)
    .reduce((sum, tx) => sum + tx.amount, 0);

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
              percentageChange={15.2} // TODO: Calculate actual percentage change
            />
            <AmountCard
              title="Expenses"
              amount={expenses}
              percentageChange={-4.5} // TODO: Calculate actual percentage change
            />
            <AmountCard title="Net Change" amount={netChange} />
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
