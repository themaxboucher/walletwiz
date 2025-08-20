"use client";

import { useState } from "react";
import { ListFilter, Plus, Receipt } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
  const [hideTransfers, setHideTransfers] = useState(false);

  const handleOpenDialog = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const pageSize = 8;

  // Filter out transfer transactions if hideTransfers is true
  const filteredTransactions = hideTransfers
    ? transactions.filter((tx) => tx.category.type !== "transfer")
    : transactions;

  return (
    <Card
      className={cn("pb-4", filteredTransactions.length <= pageSize && "pb-0")}
    >
      <div className="flex justify-between pr-6">
        <CardHeader className="w-full">
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <div className="flex items-center gap-2">
          {transactions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <ListFilter className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={hideTransfers}
                  onCheckedChange={setHideTransfers}
                >
                  Hide transfers
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {filteredTransactions.length > 0 && (
            <Button size="sm" onClick={() => handleOpenDialog()}>
              <Plus className="size-3.5 opacity-75" />
              <span>Add Transaction</span>
            </Button>
          )}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-5 text-primary" />}
          title={
            hideTransfers
              ? "No non-transfer transactions"
              : "No transactions yet"
          }
          description={
            hideTransfers
              ? "All transactions are transfers. Uncheck 'Hide transfers' to see them."
              : "Start tracking your finances by adding your first transaction."
          }
          buttonText="Add Transaction"
          onAddClick={() => handleOpenDialog()}
        />
      ) : (
        <TransactionTable
          transactions={filteredTransactions}
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
