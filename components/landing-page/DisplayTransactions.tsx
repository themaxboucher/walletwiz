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
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { formatCurrency } from "@/lib/utils";
import CategoryBadge from "../dashboard/CategoryBadge";
import { displayTransactions } from "@/constants";

export default function DisplayTransactions() {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-3 px-6 text-muted-foreground">
              Merchant
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
                <Avatar className="size-6">
                  {tx.merchantLogo && (
                    <AvatarImage src={tx.merchantLogo} alt={tx.merchantName} />
                  )}
                  <AvatarFallback>
                    <Store className="size-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                {tx.merchantName}
              </TableCell>
              <TableCell className="py-3 font-medium text-left">
                {tx.amount > 0 ? "+" : ""}
                {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell className="py-3">
                <CategoryBadge
                  color={tx.category.color}
                  lucideIconName={tx.category.iconName}
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
