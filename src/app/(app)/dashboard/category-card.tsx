import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryCard {
  name: string;
  icon: React.ReactNode;
  amount: number;
  stat: string;
}

export default function CategoryCard({
  name,
  icon,
  amount,
  stat,
}: CategoryCard) {
  return (
    <Card className="min-w-60 hover:border-primary ease-out duration-200 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{amount}</div>
        <p className="text-xs text-muted-foreground">{stat}</p>
      </CardContent>
    </Card>
  );
}
