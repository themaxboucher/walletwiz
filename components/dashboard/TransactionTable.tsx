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
import { MoreVertical, Edit, Trash2, Store } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { format } from "date-fns";
import CategoryBadge from "./CategoryBadge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { formatCurrency } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  pageSize?: number;
  onEditClick: (transaction: Transaction) => void;
}

export default function TransactionTable({
  transactions,
  pageSize = 7,
  onEditClick,
}: TransactionTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(transactions.length / pageSize);
  const paginated = transactions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
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
            <TableHead className="py-3 text-muted-foreground">
              Account
            </TableHead>
            <TableHead className="py-3 px-6 text-muted-foreground text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-muted/40">
              <TableCell className="py-3 px-6 font-medium flex items-center gap-3">
                <Avatar className="size-6">
                  {tx.merchantLogo && (
                    <AvatarImage src={tx.merchantLogo} alt={tx.merchant} />
                  )}
                  <AvatarFallback>
                    <Store className="size-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                {tx.merchant}
              </TableCell>
              <TableCell className="py-3 font-medium">
                {tx.amount > 0 ? "+" : ""}
                {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell className="py-3">
                <CategoryBadge
                  color={tx.category.color}
                  lucideIconName={tx.category.lucideIconName}
                >
                  {tx.category.name}
                </CategoryBadge>
              </TableCell>
              <TableCell className="py-3 text-muted-foreground">
                {format(new Date(tx.date), "PP")}
              </TableCell>
              <TableCell className="py-3">{tx.account}</TableCell>
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
                    <DropdownMenuItem
                      className="font-medium"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2 " /> Delete
                    </DropdownMenuItem>
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
