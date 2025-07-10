"use client";

import Greeting from "./Greeting";
import Transactions from "./Transactions";
import Balance from "./Balance";
import AmountCard from "./AmountCard";
import { useState, useMemo } from "react";
import {
  calculateIncome,
  calculateExpenses,
  calculateNetChange,
  calculateTotalBalance,
  calculatePreviousPeriodMetrics,
  getPeriodText,
  percentageChange,
  filterByRange,
  generateBalanceChartData,
  getRangeStartDate,
} from "@/lib/utils";
import Budget from "./Budget";
import Accounts from "./Accounts";
import TimeRangeSelector from "./TimeRangeSelector";

interface DashboardContentProps {
  user: User;
  transactions: Transaction[];
  categories: Category[];
}

export default function DashboardContent({
  user,
  transactions,
  categories,
}: DashboardContentProps) {
  // State for last date and range
  const [lastDate, setLastDate] = useState<Date>(new Date());
  const [selectedRange, setSelectedRange] = useState<string>("1M");

  // Filter transactions up to and including the selected date and range
  const filteredTransactions = useMemo(() => {
    const upToDate = transactions.filter(
      (tx) => new Date(tx.date) <= new Date(lastDate.setHours(23, 59, 59, 999))
    );
    return filterByRange(upToDate, lastDate, selectedRange);
  }, [transactions, lastDate, selectedRange]);

  // Generate balance chart data for all transactions up to lastDate and filter by range
  const chartFromDate = useMemo(
    () => getRangeStartDate(lastDate, selectedRange, transactions),
    [lastDate, selectedRange, transactions]
  );
  const chartToDate = lastDate;
  const filteredChartData = useMemo(
    () =>
      generateBalanceChartData(transactions, {
        from: chartFromDate,
        to: chartToDate,
      }),
    [transactions, chartFromDate, chartToDate]
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

  // Calculate total balance from all transactions up to the selected day
  const totalBalance = useMemo(
    () => calculateTotalBalance(transactions, lastDate),
    [transactions, lastDate]
  );

  // Calculate previous period metrics for comparison
  const { previousIncome, previousExpenses, previousNetChange } = useMemo(
    () =>
      calculatePreviousPeriodMetrics(transactions, {
        from: chartFromDate,
        to: chartToDate,
      }),
    [transactions, chartFromDate, chartToDate]
  );

  // Calculate percentage changes for income, expenses, and net change
  const incomePercentageChange = percentageChange(income, previousIncome);
  const expensesPercentageChange = percentageChange(expenses, previousExpenses);
  const savedPercentageChange = percentageChange(netChange, previousNetChange);

  // Calculate period text for AmountCard tooltip
  const periodText = useMemo(
    () => getPeriodText({ from: chartFromDate, to: chartToDate }),
    [chartFromDate, chartToDate]
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold md:text-xl">
            <Greeting />, {user.firstName}
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's what's happening with your money.
          </p>
        </div>
        <TimeRangeSelector
          lastDate={lastDate}
          onDateChange={setLastDate}
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
          <Transactions
            transactions={filteredTransactions}
            categories={categories}
            filteredOut={
              transactions.length > 0 && filteredTransactions.length === 0
            }
          />
        </div>
        <div className="col-span-1 flex flex-col gap-5">
          <Budget
            transactions={transactions}
            categories={categories}
            user={user}
          />
          <Accounts />
        </div>
      </div>
    </>
  );
}
