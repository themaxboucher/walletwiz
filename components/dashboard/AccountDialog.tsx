"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AccountForm from "./AccountForm";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountToEdit?: Account | null;
  userId: string;
}

export default function AccountDialog({
  open,
  onOpenChange,
  accountToEdit,
  userId,
}: AccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>
            {accountToEdit ? "Edit Account" : "Add Account"}
          </DialogTitle>
        </DialogHeader>
        <AccountForm
          accountToEdit={accountToEdit}
          onCancel={() => onOpenChange(false)}
          userId={userId}
        />
      </DialogContent>
    </Dialog>
  );
}
