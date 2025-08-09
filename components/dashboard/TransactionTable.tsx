"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Store, Landmark } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { format } from "date-fns";
import CategoryBadge from "./CategoryBadge";
import {
  formatCurrency,
  createBrandfetchIconUrl,
  getLucideIconByName,
} from "@/lib/utils";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import { cn } from "@/lib/utils";
import { accountTypeIcons } from "@/constants";
import Image from "next/image";

interface TransactionTableProps {
  transactions: Transaction[];
  accounts: Account[];
  pageSize?: number;
  onEditClick: (transaction: Transaction) => void;
}

export default function TransactionTable({
  transactions,
  accounts,
  pageSize = 10,
  onEditClick,
}: TransactionTableProps) {
  const [page, setPage] = useState(1);
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const totalPages = Math.ceil(sortedTransactions.length / pageSize);
  const paginated = sortedTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div>
      <Table className={cn(transactions.length > pageSize && "border-b")}>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-3 px-6 text-muted-foreground">
              Payee
            </TableHead>
            <TableHead className="py-3 text-muted-foreground">Amount</TableHead>
            <TableHead className="py-3 text-muted-foreground">
              Account
            </TableHead>
            <TableHead className="py-3 text-muted-foreground">
              Category
            </TableHead>
            <TableHead className="py-3 text-muted-foreground">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((tx) => (
            <TableRow key={tx.$id} className="hover:bg-muted/40">
              <TableCell className="py-3 px-6 font-medium flex items-center gap-3">
                {(() => {
                  const payeeAccountId = tx.payee?.account?.$id;
                  const payeeAccount = payeeAccountId
                    ? accounts.find((a) => a.$id === payeeAccountId)
                    : undefined;
                  const brandDomain = payeeAccount?.type?.brandDomain;
                  const institutionDomain = payeeAccount?.institution?.domain;
                  if (brandDomain || institutionDomain) {
                    return (
                      <Image
                        width={24}
                        height={24}
                        src={createBrandfetchIconUrl(
                          brandDomain || institutionDomain!,
                          24
                        )}
                        alt={`${
                          payeeAccount?.name || tx.payee?.name || "Account"
                        } logo`}
                        className="size-6 p-[2px] rounded-[0.35rem] object-cover"
                        unoptimized
                      />
                    );
                  }
                  const typeIconName = payeeAccount?.type?.iconName;
                  if (typeIconName && accountTypeIcons[typeIconName]) {
                    const Icon = getLucideIconByName(
                      accountTypeIcons,
                      typeIconName
                    );
                    return (
                      <div className="size-[22px] m-[2px] rounded-[0.35rem] bg-muted flex items-center justify-center">
                        {Icon ? (
                          <Icon className="size-3.5 text-muted-foreground" />
                        ) : null}
                      </div>
                    );
                  }
                  if (tx.payee?.domain) {
                    return (
                      <Image
                        width={24}
                        height={24}
                        src={createBrandfetchIconUrl(tx.payee.domain, 24)}
                        alt={`${tx.payee.name} logo`}
                        className="size-6 rounded-full object-cover"
                        unoptimized
                      />
                    );
                  }
                  return (
                    <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                      <Store className="size-4 text-muted-foreground" />
                    </div>
                  );
                })()}
                {(() => {
                  const payeeAccountId = tx.payee?.account?.$id;
                  const payeeAccount = payeeAccountId
                    ? accounts.find((a) => a.$id === payeeAccountId)
                    : undefined;
                  return (
                    payeeAccount?.name ||
                    tx.payee?.account?.name ||
                    tx.payee?.name ||
                    "Unknown payee"
                  );
                })()}
              </TableCell>
              <TableCell
                className={cn(
                  "py-3 font-medium",
                  tx.amount > 0 && "text-primary"
                )}
              >
                {tx.amount > 0 ? "+" : ""}
                {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell className="py-3">
                {(() => {
                  if (!tx.account?.name) return "-";

                  const brandDomain =
                    tx.account.type?.brandDomain ||
                    tx.account.institution?.domain;

                  if (brandDomain) {
                    return (
                      <span className="inline-flex items-center gap-2 max-w-[8rem]">
                        <Image
                          width={18}
                          height={18}
                          src={createBrandfetchIconUrl(brandDomain, 18)}
                          alt={`${tx.account.name} logo`}
                          className="size-4.5 rounded-[0.188rem] object-cover"
                          unoptimized
                        />
                        <span className="truncate">
                          {(tx.account.mask && (
                            <>
                              <span className="tracking-tighter">••••</span>{" "}
                              {tx.account.mask}
                            </>
                          )) ||
                            tx.account.name}
                        </span>
                      </span>
                    );
                  }

                  const typeIconName = tx.account.type?.iconName;
                  const TypeIcon = getLucideIconByName(
                    accountTypeIcons,
                    typeIconName
                  );
                  return (
                    <div className="inline-flex items-center gap-2">
                      <div className="size-4.5 rounded-[0.188rem] bg-muted flex items-center justify-center">
                        {TypeIcon ? (
                          <TypeIcon className="size-3 text-muted-foreground" />
                        ) : (
                          <Landmark className="size-3 text-muted-foreground" />
                        )}
                      </div>
                      {tx.account.name}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell className="py-3">
                <CategoryBadge
                  color={tx.category.color}
                  iconName={tx.category.iconName}
                >
                  {tx.category.name}
                </CategoryBadge>
              </TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {format(new Date(tx.date), "PP")}
              </TableCell>
              <TableCell className="py-3 px-6 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() => onEditClick(tx)}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DeleteTransactionDialog
                      transactionId={String(tx.$id)}
                      trigger={
                        <DropdownMenuItem
                          className="font-medium"
                          variant="destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4 mr-6">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-xs">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
