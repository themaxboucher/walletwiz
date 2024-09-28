import { columns, Transaction } from "@/app/(app)/dashboard/columns";
import { DataTable } from "@/app/(app)/dashboard/data-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { CirclePlus, File } from "lucide-react";
import { EditTransaction } from "./edit-transaction";

export default function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
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
          <EditTransaction>
            <Button size="sm" className="h-7 gap-1 text-sm">
              <CirclePlus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Add Transaction</span>
            </Button>
          </EditTransaction>
        </div>
      </div>
      <CardContent>
        <DataTable columns={columns} data={transactions} />
      </CardContent>
    </Card>
  );
}
