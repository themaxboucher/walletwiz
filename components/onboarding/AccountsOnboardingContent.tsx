"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import AccountsOnboardingForm from "./AccountsOnboardingForm";
import CardStack from "../dashboard/CardStack";

interface AccountsOnboardingContentProps {
  user: User;
  accounts: Account[];
}

export default function AccountsOnboardingContent({
  user,
  accounts: initialAccounts,
}: AccountsOnboardingContentProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

  const handleAddAccount = (newAccount: Account) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const canContinue = accounts.length >= 1;

  return (
    <div className="w-full max-w-4xl space-y-10">
      <div className="flex flex-col items-center text-center gap-1">
        <h1 className="text-2xl font-medium">Add your financial accounts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add at least one bank account or credit card to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 align-middle sm:grid-cols-2 gap-10">
        <AccountsOnboardingForm userId={user.$id} onAdd={handleAddAccount} />
        {accounts.length == 0 && (
          <div className="aspect-[1.75] w-full max-w-md border-2 border-dashed rounded-xl flex justify-center items-center">
            <p className="text-sm text-muted-foreground">
              Add your first account to get started.
            </p>
          </div>
        )}
        {accounts.length > 0 && (
          <div className="relative max-h-80 overflow-y-auto no-scrollbar pt-4 px-4 mb-2">
            <CardStack accounts={accounts} className="-mb-16" />
            <div className="absolute z-99 top-0 left-0 right-0 w-full h-4 bg-gradient-to-b from-background to-transparent pointer-events-none" />
            <div className="sticky z-99 bottom-0 left-0 right-0 w-full h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {canContinue ? (
          <Button asChild>
            <Link href="/onboarding/categories">Continue</Link>
          </Button>
        ) : (
          <Button disabled>Continue</Button>
        )}
      </div>
    </div>
  );
}
