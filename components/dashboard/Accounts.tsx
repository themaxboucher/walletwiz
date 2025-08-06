import { Landmark, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import EmptyState from "./EmptyState";
import AccountDialog from "./AccountDialog";
import { useState, useEffect, useRef } from "react";
import AccountItem from "./AccountItem";

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
  const [stackOrder, setStackOrder] = useState<string[]>(
    accounts.map((account) => account.$id).filter(Boolean) as string[]
  );
  const [cardHeight, setCardHeight] = useState(256); // Default height
  const cardOffset = 70; // Offset between stacked cards
  const topCardRef = useRef<HTMLDivElement>(null);

  const handleOpenDialog = (account?: Account) => {
    setEditingAccount(account || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAccount(null);
  };

  // Update stack order when accounts change
  useEffect(() => {
    const currentAccountIds = accounts
      .map((account) => account.$id)
      .filter(Boolean) as string[];
    setStackOrder((prev) => {
      // Keep existing order for accounts that still exist, add new ones to the front
      const existingIds = prev.filter((id) => currentAccountIds.includes(id));
      const newIds = currentAccountIds.filter((id) => !prev.includes(id));
      return [...newIds, ...existingIds];
    });
  }, [accounts]);

  // Measure the actual height of the top card
  useEffect(() => {
    if (topCardRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setCardHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(topCardRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [stackOrder]); // Re-run when stackOrder changes to ensure we're measuring the right card

  const bringToFront = (accountId: string) => {
    setStackOrder((prev) => {
      const filtered = prev.filter((id) => id !== accountId);
      return [accountId, ...filtered];
    });
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
          <div
            className="relative w-full"
            style={{
              height: `${cardHeight + (accounts.length - 1) * cardOffset}px`,
            }}
          >
            {stackOrder.map((accountId, index) => {
              const account = accounts.find((acc) => acc.$id === accountId);
              if (!account) return null;

              const stackIndex = stackOrder.length - 1 - index;
              const isTopCard = index === 0;

              return (
                <div
                  key={account.$id}
                  ref={isTopCard ? topCardRef : undefined}
                  className={`absolute flex flex-col items-center transition-all duration-300 ease-out w-full ${
                    !isTopCard ? "hover:cursor-pointer" : ""
                  }`}
                  style={{
                    top: `${stackIndex * cardOffset}px`,
                    zIndex: stackIndex + 1,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isTopCard && account.$id) {
                      bringToFront(account.$id);
                    }
                  }}
                >
                  <AccountItem
                    account={account}
                    onClick={
                      isTopCard ? () => handleOpenDialog(account) : undefined
                    }
                    transactions={transactions}
                  />
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
