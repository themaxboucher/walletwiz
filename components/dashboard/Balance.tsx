import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Balance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">$2,890.34</p>
      </CardContent>
    </Card>
  );
}
