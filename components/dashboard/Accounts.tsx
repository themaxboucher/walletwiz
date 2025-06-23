import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import EmptyState from "./EmptyState";
import InfoBadge from "../InfoBadge";
import { institutions } from "@/constants";
import Image from "next/image";

const placeholderAccounts = [
  {
    bank: "RBC",
    type: "Chequing",
    number: "**** 1234",
    logo: institutions.find((i) => i.name === "RBC")?.url,
    color: "bg-blue-500/10",
  },
  {
    bank: "TD Canada Trust",
    type: "Credit",
    number: "**** 5678",
    logo: institutions.find((i) => i.name === "TD Canada Trust")?.url,
    color: "bg-green-500/10",
  },
  {
    bank: "Scotiabank",
    type: "Savings",
    number: "**** 9012",
    logo: institutions.find((i) => i.name === "Scotiabank")?.url,
    color: "bg-red-500/10",
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
          {placeholderAccounts.map((acc) => (
            <div
              key={acc.number}
              className={`flex items-center gap-4 rounded-xl p-4 shadow-sm border border-border border-dashed opacity-70 grayscale ${acc.color}`}
            >
              {acc.logo ? (
                <Image
                  src={acc.logo}
                  alt={acc.bank}
                  width={40}
                  height={40}
                  className="rounded-full border bg-white"
                />
              ) : (
                <CreditCard className="size-10 text-muted-foreground" />
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-base">{acc.bank}</span>
                <span className="text-xs text-muted-foreground">
                  {acc.type} · {acc.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
