import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import TransactionTable, { Transaction } from "./TransactionTable";

const mockTransactions: Transaction[] = [
  {
    id: 1,
    merchant: "Google",
    amount: 5000,
    account: "Checking",
    category: {
      name: "Salary",
      lucideIconName: "DollarSign",
      color: "primary",
    },
    date: "2025-05-31",
    merchantLogo: "https://logo.clearbit.com/google.com",
  },
  {
    id: 3,
    merchant: "Whole Foods",
    amount: -150,
    account: "Credit Card",
    category: {
      name: "Groceries",
      lucideIconName: "ShoppingCart",
      color: "blue",
    },
    date: "2025-06-02",
    merchantLogo: "https://logo.clearbit.com/wholefoodsmarket.com",
  },
  {
    id: 4,
    merchant: "Con Edison",
    amount: -80,
    account: "Checking",
    category: {
      name: "Utilities",
      lucideIconName: "Lightbulb",
      color: "yellow",
    },
    date: "2025-06-03",
    merchantLogo: "https://logo.clearbit.com/coned.com",
  },
  {
    id: 5,
    merchant: "Uber",
    amount: -45,
    account: "Savings",
    category: {
      name: "Transport",
      lucideIconName: "Car",
      color: "violet",
    },
    date: "2025-06-03",
    merchantLogo: "https://logo.clearbit.com/uber.com",
  },
  {
    id: 6,
    merchant: "Amazon",
    amount: -200,
    account: "Credit Card",
    category: {
      name: "Shopping",
      lucideIconName: "ShoppingBag",
      color: "pink",
    },
    date: "2025-06-04",
    merchantLogo: "https://logo.clearbit.com/amazon.com",
  },
  {
    id: 7,
    merchant: "Freelance Client A",
    amount: 1200,
    account: "Paypal",
    category: {
      name: "Income",
      lucideIconName: "Briefcase",
      color: "primary",
    },
    date: "2025-06-05",
    merchantLogo: "https://logo.clearbit.com/paypal.com",
  },
  {
    id: 8,
    merchant: "The Spotted Pig",
    amount: -70,
    account: "Credit Card",
    category: {
      name: "Food and beverage",
      lucideIconName: "Utensils",
      color: "orange",
    },
    date: "2025-06-05",
    merchantLogo: "https://logo.clearbit.com/thespottedpig.com",
  },
  {
    id: 9,
    merchant: "Verizon",
    amount: -60,
    account: "Checking",
    category: {
      name: "Utilities",
      lucideIconName: "Smartphone",
      color: "yellow",
    },
    date: "2025-06-06",
    merchantLogo: "https://logo.clearbit.com/verizon.com",
  },
  {
    id: 10,
    merchant: "Local Coffee Shop",
    amount: -8.5,
    account: "Credit Card",
    category: {
      name: "Food and beverage",
      lucideIconName: "Utensils",
      color: "orange",
    },
    date: "2025-06-07",
    merchantLogo: null,
  },
  {
    id: 11,
    merchant: "Street Vendor",
    amount: -12.0,
    account: "Cash",
    category: {
      name: "Food and beverage",
      lucideIconName: "Utensils",
      color: "orange",
    },
    date: "2025-06-07",
    merchantLogo: null,
  },
  {
    id: 12,
    merchant: "Neighborhood Laundry",
    amount: -25.0,
    account: "Checking",
    category: {
      name: "Utilities",
      lucideIconName: "Lightbulb",
      color: "yellow",
    },
    date: "2025-06-08",
    merchantLogo: null,
  },
];

export default function Transactions() {
  return (
    <Card>
      <div className="flex justify-between pr-6">
        <CardHeader className="w-full">
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <Button size="sm" variant="outline">
          <Plus className="h-3.5 w-3.5" />
          <span>Add Transaction</span>
        </Button>
      </div>

      <TransactionTable transactions={mockTransactions} pageSize={7} />
    </Card>
  );
}
