import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { CircleX, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteFinancialAccount } from "@/lib/actions/account.actions";
import { toast } from "sonner";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  onAccountDeleted?: () => void;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  accountId,
  onAccountDeleted,
}: DeleteAccountDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteFinancialAccount(accountId);
      onOpenChange(false);
      onAccountDeleted?.(); // Close the parent account form dialog
      router.refresh();
    } catch (error) {
      toast("Error deleting account", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this account? This action cannot be
            undone.
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
