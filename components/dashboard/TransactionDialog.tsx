"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import TransactionForm from "./TransactionForm";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionToEdit?: Transaction | null; // Optional prop for editing
  categories: Category[];
}

export default function TransactionDialog({
  open,
  onOpenChange,
  transactionToEdit,
  categories, // Destructure categories prop
}: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>
            {transactionToEdit ? "Edit Transaction" : "Add New Transaction"}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          transactionToEdit={transactionToEdit}
          onCancel={() => onOpenChange(false)} // Pass close function to form's cancel button
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}
