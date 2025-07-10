import { Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import InfoBadge from "../InfoBadge";

const genericInstitutions = [
  {
    name: "Atlas Bank",
    type: "Checking",
    number: "**** 1234",
    icon: Landmark,
    color: "bg-blue-500/10",
  },
  {
    name: "Pioneer Trust",
    type: "Savings",
    number: "**** 5678",
    icon: Landmark,
    color: "bg-green-500/10",
  },
  {
    name: "Summit Financial",
    type: "Credit",
    number: "**** 9012",
    icon: Landmark,
    color: "bg-violet-500/10",
  },
];

export default function Accounts() {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <CardTitle>Accounts</CardTitle>
        <InfoBadge>Soon</InfoBadge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {genericInstitutions.map((inst) => (
            <div
              key={inst.number}
              className={`flex items-center gap-4 rounded-xl p-4 shadow-sm border border-border border-dashed opacity-70 grayscale ${inst.color}`}
            >
              <inst.icon className="size-6 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-semibold text-base">{inst.name}</span>
                <span className="text-xs text-muted-foreground">
                  {inst.type} · {inst.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
