import { columns } from "@/app/(app)/dashboard/columns";
import { DataTable } from "@/app/(app)/dashboard/data-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { CirclePlus, File } from "lucide-react";

export default function TransactionsTable() {
  const data = [
    {
      id: "1",
      updated_at: "2024-08-17T12:00:00Z",
      amount: -43.2,
      description: "AMAZON",
      date: "2024-08-17T12:00:00Z",
      category: "Misc Expense",
      note: "Inflatable duck for a very fun weekend",
    },
    {
      id: "2",
      updated_at: "2024-08-17T12:00:00Z",
      amount: -775,
      description: "Rent",
      date: "2024-08-17T12:00:00Z",
      category: "Rent",
      note: "",
    },
    {
      id: "3",
      updated_at: "2024-08-17T12:00:00Z",
      amount: 756.02,
      description: "GUSTO",
      date: "2024-08-17T12:00:00Z",
      category: "Work Income",
      note: "",
    },
    {
      id: "4",
      updated_at: "2024-08-17T12:00:00Z",
      amount: -66.74,
      description: "Safeway",
      date: "2024-08-17T12:00:00Z",
      category: "Groceries",
      note: "",
    },
  ];
  return (
    <Card>
      <div className="flex justify-between items-center gap-8">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Income and expenses</CardDescription>
        </CardHeader>
        <div className="flex items-center justify-end gap-2 p-6">
          <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
          <Button size="sm" className="h-7 gap-1 text-sm">
            <CirclePlus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">New Transaction</span>
          </Button>
        </div>
      </div>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
