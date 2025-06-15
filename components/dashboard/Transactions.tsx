"use client";

import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import TransactionTable from "./TransactionTable";
import TransactionDialog from "./TransactionDialog";
import EmptyState from "./EmptyState";

export default function Transactions(props: { transactions: Transaction[] }) {
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
        {props.transactions.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Transaction</span>
          </Button>
        )}
      </div>

      {props.transactions.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-5 text-primary" />}
          title="No transactions yet"
          description="Start tracking your finances by adding your first transaction."
          buttonText="Add Transaction"
          onAddClick={() => handleOpenDialog()}
        />
      ) : (
        <TransactionTable
          transactions={props.transactions}
          pageSize={7}
          onEditClick={handleOpenDialog}
        />
      )}

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        transactionToEdit={editingTransaction}
      />
    </Card>
  );
}
