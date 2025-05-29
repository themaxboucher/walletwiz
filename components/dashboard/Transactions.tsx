import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function Transactions() {
  return (
    <Card>
      <div className="flex justify-between items-center gap-8">
        <CardHeader>
          <CardTitle className="text-lg">Transactions</CardTitle>
          <CardDescription>Income and expenses</CardDescription>
        </CardHeader>
        <div className="flex items-center justify-end gap-2 p-6">
          Add Transactions
        </div>
      </div>
    </Card>
  );
}
