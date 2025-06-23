"use client";

import Greeting from "./Greeting";
import Transactions from "./Transactions";
import Balance from "./Balance";
import AmountCard from "./AmountCard";
import TimeRangeSelector from "./TimeRangeSelector";
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import {
  filterTransactionsByDateRange,
  generateBalanceChartData,
  filterChartDataByDateRange,
  calculateIncome,
  calculateExpenses,
  calculateNetChange,
  calculateTotalBalance,
  calculatePreviousPeriodMetrics,
  getPeriodText,
  percentageChange,
} from "@/lib/utils";
import Budget from "./Budget";
import Accounts from "./Accounts";

interface DashboardContentProps {
  user: {
    firstName: string;
  };
  transactions: Transaction[];
  categories: Category[];
}

export default function DashboardContent({
  user,
  transactions,
  categories,
}: DashboardContentProps) {
  // State for date range
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  // Filter transactions based on date range
  const filteredTransactions = useMemo(
    () => filterTransactionsByDateRange(transactions, dateRange),
    [transactions, dateRange]
  );

  // Generate balance chart data for all transactions
  const allChartData = useMemo(
    () => generateBalanceChartData(transactions, dateRange),
    [transactions, dateRange]
  );

  // Filter chart data based on selected date range
  const filteredChartData = useMemo(
    () => filterChartDataByDateRange(allChartData, dateRange),
    [allChartData, dateRange]
  );

  // Calculate totals from filtered transactions
  const income = useMemo(
    () => calculateIncome(filteredTransactions),
    [filteredTransactions]
  );
  const expenses = useMemo(
    () => calculateExpenses(filteredTransactions),
    [filteredTransactions]
  );
  const netChange = useMemo(
    () => calculateNetChange(income, expenses),
    [income, expenses]
  );

  // Calculate total balance from all transactions up to today
  const totalBalance = useMemo(
    () => calculateTotalBalance(transactions),
    [transactions]
  );

  // Calculate previous period metrics for comparison
  const { previousIncome, previousExpenses, previousNetChange } = useMemo(
    () => calculatePreviousPeriodMetrics(transactions, dateRange),
    [transactions, dateRange]
  );

  // Calculate percentage changes for income, expenses, and net change
  const incomePercentageChange = percentageChange(income, previousIncome);
  const expensesPercentageChange = percentageChange(expenses, previousExpenses);
  const savedPercentageChange = percentageChange(netChange, previousNetChange);

  // Calculate period text for AmountCard tooltip
  const periodText = useMemo(() => getPeriodText(dateRange), [dateRange]);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold md:text-xl">
            <Greeting />, {user.firstName}
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's what's happening with your money.
          </p>
        </div>
        <TimeRangeSelector
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          transactions={transactions}
        />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="flex flex-col gap-5 col-span-2">
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
          <Transactions transactions={transactions} categories={categories} />
        </div>
        <div className="col-span-1 flex flex-col gap-5">
          <Budget transactions={transactions} categories={categories} />
          <Accounts />
        </div>
      </div>
    </>
  );
}
