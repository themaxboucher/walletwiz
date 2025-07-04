import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { categoryIcons, categoryColors } from "@/constants";

interface CategoryBadgeProps {
  children: React.ReactNode;
  iconName: string;
  color: CategoryColor;
}

export default function CategoryBadge(props: CategoryBadgeProps) {
  const dynamicColorClass = categoryColors[props.color];
  const IconComponent = categoryIcons[props.iconName];

  if (!IconComponent) {
    console.warn(`Lucide icon \'${props.iconName}\' not found in mapping.`);
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
