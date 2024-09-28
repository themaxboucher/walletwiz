import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, Copy, Trash } from "lucide-react";
import { Separator } from "../../../components/ui/separator";
import { Textarea } from "../../../components/ui/textarea";
import { ReactNode } from "react";
import { DatePicker } from "../../../components/ui/date-picker";
import TransactionForm from "./transaction-form";

interface EditTransactionProps {
  children: ReactNode;
}

export function EditTransaction({ children }: EditTransactionProps) {
  const date = new Date();

  // Get the day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  // Determine the ordinal suffix
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || [11, 12, 13].includes(day % 100) ? 0 : day % 10
  ];

  // Format the date with the ordinal suffix
  const readableDate = `${month} ${day}${suffix}, ${year}`;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0">
        <DialogHeader className=" p-6 border-b border-border">
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <div className="px-6">
          <TransactionForm />
          <div className="flex items-center justify-end py-6">
            <p className="text-sm text-muted-foreground text-right">
              Transaction last modified {readableDate}.
            </p>
          </div>
        </div>
        <DialogFooter className="p-6 border-t border-border bg-muted/50">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
