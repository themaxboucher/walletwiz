import {
  Activity,
  CircleArrowDownIcon,
  CircleArrowUp,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import CardScroller from "./card-scroller";
import CategoryCard from "./category-card";

export default function CategoryCards() {
  const categories = [
    {
      name: "All",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      amount: 2301.42,
      stat: "11% more that last month",
    },
    {
      name: "Income",
      icon: <CircleArrowUp className="h-4 w-4 text-muted-foreground" />,
      amount: 2301.42,
      stat: "11% more that last month",
    },
    {
      name: "Expenses",
      icon: <CircleArrowDownIcon className="h-4 w-4 text-muted-foreground" />,
      amount: 2301.42,
      stat: "11% more that last month",
    },
  ];
  return (
    <CardScroller>
      {categories.map((category) => (
        <CategoryCard key={category.name} {...category} />
      ))}
    </CardScroller>
  );
}
