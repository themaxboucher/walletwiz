"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import BudgetForm from "./BudgetForm";

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

export default function BudgetDialog({
  open,
  onOpenChange,
  categories,
}: BudgetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Budget</DialogTitle>
        </DialogHeader>
        <BudgetForm
          onCancel={() => onOpenChange(false)}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}
