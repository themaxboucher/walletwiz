"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Store } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency, createBrandfetchIconUrl, cn } from "@/lib/utils";
import CategoryBadge from "../dashboard/CategoryBadge";
import { displayTransactions } from "@/constants";
import Image from "next/image";

export default function DisplayTransactions() {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-3 px-6 text-muted-foreground">
              Payee
            </TableHead>
            <TableHead className="py-3 text-muted-foreground">Amount</TableHead>
            <TableHead className="py-3 text-muted-foreground">
              Category
            </TableHead>
            <TableHead className="py-3 text-muted-foreground">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayTransactions.map((tx) => (
            <TableRow key={tx.$id} className="hover:bg-transparent">
              <TableCell className="py-3 px-6 font-medium flex items-center gap-3">
                {tx.payee?.domain ? (
                  <Image
                    width={24}
                    height={24}
                    src={createBrandfetchIconUrl(tx.payee.domain, 24)}
                    alt={`${tx.payee.name} logo`}
                    className="size-6 rounded-full object-cover"
                    unoptimized // Necessary for brandfetch.io hotlinking guidelines
                  />
                ) : (
                  <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                    <Store className="size-4 text-muted-foreground" />
                  </div>
                )}
                {tx.payee?.name || "Unknown payee"}
              </TableCell>
              <TableCell
                className={cn(
                  "py-3 font-medium text-left",
                  tx.amount > 0 && "text-primary"
                )}
              >
                {tx.amount > 0 ? "+" : ""}
                {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell className="py-3">
                <CategoryBadge
                  color={tx.category.color}
                  iconName={tx.category.iconName}
                >
                  {tx.category.name}
                </CategoryBadge>
              </TableCell>
              <TableCell className="py-3 text-muted-foreground text-left">
                {format(new Date(tx.date), "PP")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
