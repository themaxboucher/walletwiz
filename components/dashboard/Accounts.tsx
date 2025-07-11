import { Landmark, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import EmptyState from "./EmptyState";
import AccountDialog from "./AccountDialog";
import { useState } from "react";
import { accountTypeIcons } from "@/constants";

interface AccountsProps {
  accounts: Account[];
  userId: string;
}

export default function Accounts({ accounts, userId }: AccountsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleOpenDialog = (account?: Account) => {
    setEditingAccount(account || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAccount(null);
  };

  console.log("Accounts:", accounts);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Accounts</CardTitle>
        {accounts.length > 0 && (
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <Plus className="size-3.5 opacity-75" />
            <span>Add Account</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {accounts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {accounts.map((account) => {
              const Icon = accountTypeIcons[account.type?.name] || Landmark;
              return (
                <div
                  key={account.$id}
                  className="group flex items-center justify-between rounded-xl p-4 shadow-sm border border-border"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="size-6 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">
                        {account.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {account.type?.name} · {account.mask || "••••"}
                      </span>
                      {account.currentBalance && (
                        <span className="text-sm font-medium">
                          ${account.currentBalance.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(account)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="size-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            onAddClick={() => handleOpenDialog()}
            icon={<Landmark className="size-6" />}
            title="No accounts yet"
            description="Add your bank accounts to see your balances and transactions in one place."
            buttonText="Add account"
          />
        )}
      </CardContent>

      <AccountDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        accountToEdit={editingAccount}
        userId={userId}
      />
    </Card>
  );
}
