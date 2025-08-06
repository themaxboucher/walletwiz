import { accountTypeIcons, cardColors } from "@/constants";
import { Landmark, Info, CircleCheck } from "lucide-react";
import { createBrandfetchIconUrl, formatCurrency, cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

interface AccountItemProps {
  account: Account;
  onClick?: () => void;
  transactions?: Transaction[];
}

export default function AccountItem({
  account,
  onClick,
  transactions = [],
}: AccountItemProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Calculate the sum of all transactions for this account
  const accountTransactions = transactions.filter(
    (tx) => tx.account?.$id === account.$id
  );
  const transactionSum = accountTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );
  const currentBalance = account.currentBalance || 0;
  const balanceDifference = currentBalance - transactionSum;
  const balancesMatch = Math.abs(balanceDifference) < 0.01; // Account for floating point precision

  // Get card color based on institution's cardColor
  const getCardColorClasses = () => {
    if (
      account.institution?.cardColor &&
      cardColors[account.institution.cardColor]
    ) {
      return cardColors[account.institution.cardColor];
    }
    // Default fallback color
    return "bg-gradient-to-br from-zinc-600 to-zinc-800 border-zinc-500";
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border-2 transition-all duration-100 ease-out shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer aspect-[1.75] w-full max-w-md text-white",
        getCardColorClasses()
      )}
      onClick={onClick}
    >
      <div className="p-5 flex flex-col justify-between gap-5 h-[calc(100%-3.25rem)]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="font-semibold text-white/95">{account.name}</div>
          <div className="flex items-center gap-3 min-w-0 w-fit">
            <div className="text-sm font-medium truncate">
              {account.mask && (
                <>
                  <span className="tracking-tighter">••••</span> {account.mask}
                </>
              )}
            </div>
            <div className="flex-shrink-0">
              {account.institution?.domain ? (
                <Image
                  width={28}
                  height={28}
                  src={createBrandfetchIconUrl(account.institution.domain, 28)}
                  alt={`${account.institution.name} logo`}
                  className="size-7 rounded-sm object-cover"
                  title={account.institution.name}
                  unoptimized
                />
              ) : (
                <Landmark className="size-8 text-white/80" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-5">
          <div className="space-y-2.5">
            <h3 className="text-2xl font-semibold text-white leading-tight w-fit">
              {formatCurrency(account.currentBalance || 0)}
            </h3>
            <div className="flex items-center gap-2">
              {account.type && (
                <div className="text-white/95 text-xs flex items-center gap-1.5">
                  {account.type.brandDomain ? (
                    <Image
                      width={16}
                      height={16}
                      src={createBrandfetchIconUrl(
                        account.type.brandDomain,
                        16
                      )}
                      alt={`${account.type.name} logo`}
                      className="size-4 rounded-[0.125rem] object-cover"
                      unoptimized
                    />
                  ) : account.type.iconName &&
                    accountTypeIcons[account.type.iconName] ? (
                    React.createElement(
                      accountTypeIcons[account.type.iconName],
                      {
                        className: "size-4 text-white/80",
                      }
                    )
                  ) : (
                    <Landmark className="size-4 text-white/80" />
                  )}
                  {account.type.name === "Other"
                    ? account.type.type === "credit"
                      ? "Credit Card"
                      : account.type.type === "depository"
                      ? "Depository"
                      : account.type.name
                    : account.type.name}
                </div>
              )}
              <span className="text-white/50">|</span>
              {balancesMatch ? (
                <div className="flex items-center gap-1.5">
                  <CircleCheck className="size-4 text-white/90" />
                  <p className="text-xs text-white/90">
                    Balance matches transactions
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Info className="size-4 text-white/90" />
                  <p className="text-xs text-white/90">
                    <span className="font-semibold">
                      {balanceDifference < 0 && "-"}
                      {formatCurrency(Math.abs(balanceDifference))}
                    </span>{" "}
                    missing from transactions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-13 bg-gradient-to-r from-white/20 to-white/8" />
      </div>
    </div>
  );
}
