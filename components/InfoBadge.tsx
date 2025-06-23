import { ReactNode } from "react";
import { Badge } from "./ui/badge";

export default function InfoBadge({ children }: { children: ReactNode }) {
  return (
    <Badge className="text-[10px] px-[0.35rem] py-[0.1rem] font-semibold text-primary bg-primary/5 border border-primary/30">
      {children}
    </Badge>
  );
}
