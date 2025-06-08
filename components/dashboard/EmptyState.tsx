import { Plus, Receipt } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  onAddClick: () => void;
}

export default function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <Receipt className="size-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        Start tracking your finances by adding your first transaction.
      </p>
      <Button onClick={onAddClick}>
        <Plus className="size-4" />
        <span>Add Transaction</span>
      </Button>
    </div>
  );
}
