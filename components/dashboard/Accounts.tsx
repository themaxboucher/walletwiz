import { Landmark, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import EmptyState from "./EmptyState";
import AccountDialog from "./AccountDialog";
import { useState } from "react";
import CardStack from "./CardStack";

interface AccountsProps {
  accounts: Account[];
  userId: string;
  transactions?: Transaction[];
}

export default function Accounts({
  accounts,
  userId,
  transactions = [],
}: AccountsProps) {
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

  const handleCardClick = (account: Account) => {
    handleOpenDialog(account);
  };

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
          <CardStack
            accounts={accounts}
            transactions={transactions}
            onCardClick={handleCardClick}
          />
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
