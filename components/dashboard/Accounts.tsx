import { CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import EmptyState from "./EmptyState";

export default function Accounts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
      </CardHeader>
      <EmptyState
        icon={<CreditCard className="size-5 text-primary" />}
        title="No connected accounts"
        description="Start tracking your finances by connecting your first financial account."
        buttonText="Add Account"
        onAddClick={() => {}}
      />
    </Card>
  );
}
