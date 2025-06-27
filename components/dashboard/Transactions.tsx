"use client";

import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import TransactionTable from "./TransactionTable";
import TransactionDialog from "./TransactionDialog";
import EmptyState from "./EmptyState";

interface TransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  filteredOut?: boolean;
}

export default function Transactions({
  transactions,
  categories,
  filteredOut = false,
}: TransactionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const handleOpenDialog = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  return (
    <Card>
      <div className="flex justify-between pr-6">
        <CardHeader className="w-full">
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        {transactions.length > 0 && (
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <Plus className="size-3.5 opacity-75" />
            <span>Add Transaction</span>
          </Button>
        )}
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-5 text-primary" />}
          title={
            filteredOut
              ? "No transactions in this period"
              : "No transactions yet"
          }
          description={
            filteredOut
              ? "Try selecting a different date or time range to see your transactions."
              : "Start tracking your finances by adding your first transaction."
          }
          buttonText="Add Transaction"
          onAddClick={() => handleOpenDialog()}
        />
      ) : (
        <TransactionTable
          transactions={transactions}
          pageSize={7}
          onEditClick={handleOpenDialog}
        />
      )}

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        transactionToEdit={editingTransaction}
        categories={categories}
      />
    </Card>
  );
}
