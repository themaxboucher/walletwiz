"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { CircleX, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTransaction } from "@/lib/actions/transaction.actions";
import { toast } from "sonner";

interface DeleteTransactionDialogProps {
  transactionId: string;
  trigger: React.ReactNode;
}

export default function DeleteTransactionDialog({
  transactionId,
  trigger,
}: DeleteTransactionDialogProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTransaction(transactionId);
      router.refresh();
    } catch (error) {
      toast("Error deleting transaction", {
        icon: <CircleX className="text-destructive size-5" />,
      });
      console.error("Error deleting transaction:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
