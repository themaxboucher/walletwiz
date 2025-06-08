"use client";

import Greeting from "./Greeting";
import { Separator } from "../ui/separator";
import Transactions from "./Transactions";
import Balance from "./Balance";
import { Card, CardHeader, CardTitle } from "../ui/card";
import AmountCard from "./AmountCard";
import TimeRangeSelector from "./TimeRangeSelector";
import { useState } from "react";

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
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  const handleRangeChange = (startDate: Date, endDate: Date) => {
    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });
    setFilteredTransactions(filtered);
  };

  // Calculate totals from filtered transactions
  const income = filteredTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expenses = filteredTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const netChange = income - expenses;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold md:text-2xl">
          <Greeting />, {user.firstName}
        </h1>
        <TimeRangeSelector
          onRangeChange={handleRangeChange}
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
          <Balance transactions={filteredTransactions} />
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
