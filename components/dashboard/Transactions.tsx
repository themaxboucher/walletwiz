"use client";

import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import TransactionTable from "./TransactionTable";
import TransactionDialog from "./TransactionDialog";
import EmptyState from "./EmptyState";
import { cn } from "@/lib/utils";

interface TransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
}

export default function Transactions({
  transactions,
  categories,
  accounts,
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

  const pageSize = 8;

  return (
    <Card className={cn("pb-4", transactions.length <= pageSize && "pb-0")}>
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
          title={"No transactions yet"}
          description={
            "Start tracking your finances by adding your first transaction."
          }
          buttonText="Add Transaction"
          onAddClick={() => handleOpenDialog()}
        />
      ) : (
        <TransactionTable
          transactions={transactions}
          accounts={accounts}
          pageSize={pageSize}
          onEditClick={handleOpenDialog}
        />
      )}

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        transactionToEdit={editingTransaction}
        categories={categories}
        accounts={accounts}
      />
    </Card>
  );
}
