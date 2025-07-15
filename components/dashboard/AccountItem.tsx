import { accountTypeIcons } from "@/constants";
import { Landmark, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import DeleteAccountDialog from "./DeleteAccountDialog";

interface AccountItemProps {
  account: any; // fallback to any to avoid linter error
  onEdit: (account: any) => void;
}

export default function AccountItem({ account, onEdit }: AccountItemProps) {
  const Icon = accountTypeIcons[account.type?.iconName] || Landmark;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="group flex items-center justify-between rounded-xl p-4 shadow-sm border border-border">
      <div className="flex items-center gap-4">
        <Icon className="size-6 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="font-semibold text-base">{account.name}</span>
          <span className="text-xs text-muted-foreground">
            {account.type?.name}
          </span>
          {account.currentBalance && (
            <span className="text-sm font-medium">
              ${account.currentBalance.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="font-medium"
            onClick={() => onEdit(account)}
          >
            <Edit className="size-4 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium"
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="size-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        accountId={account.$id}
      />
    </div>
  );
}
