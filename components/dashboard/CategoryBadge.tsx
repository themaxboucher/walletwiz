import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Home,
  ShoppingCart,
  Lightbulb,
  Car,
  ShoppingBag,
  Briefcase,
  Utensils,
  Smartphone,
} from "lucide-react";

interface CategoryBadgeProps {
  children: React.ReactNode;
  lucideIconName: string;
  color:
    | "red"
    | "yellow"
    | "orange"
    | "cyan"
    | "blue"
    | "violet"
    | "pink"
    | "green";
}

const colorMap: Record<CategoryBadgeProps["color"], string> = {
  red: "text-red-500",
  yellow: "text-yellow-500",
  orange: "text-orange-500",
  cyan: "text-cyan-500",
  blue: "text-blue-500",
  violet: "text-violet-500",
  pink: "text-pink-500",
  green: "text-primary",
};

const iconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  DollarSign: DollarSign,
  Home: Home,
  ShoppingCart: ShoppingCart,
  Lightbulb: Lightbulb,
  Car: Car,
  ShoppingBag: ShoppingBag,
  Briefcase: Briefcase,
  Utensils: Utensils,
  Smartphone: Smartphone,
};

export default function CategoryBadge(props: CategoryBadgeProps) {
  const dynamicColorClass = colorMap[props.color] || "text-muted-foreground"; // Fallback
  const IconComponent = iconMap[props.lucideIconName];

  if (!IconComponent) {
    console.warn(
      `Lucide icon \'${props.lucideIconName}\' not found in mapping.`
    );
    return (
      <Badge
        variant="outline"
        className="flex justify-center items-center gap-[.35rem] font-semibold rounded-lg"
      >
        <span>{props.children}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="flex justify-center items-center gap-[.35rem] font-semibold rounded-lg"
    >
      <IconComponent className={cn("h-3 w-3", dynamicColorClass)} />
      <span>{props.children}</span>
    </Badge>
  );
}
