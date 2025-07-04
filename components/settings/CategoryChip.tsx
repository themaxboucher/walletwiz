import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { categoryIcons, categoryColors } from "@/constants";
import { CircleCheck, Plus, X } from "lucide-react";

interface CategoryChipProps {
  children: React.ReactNode;
  iconName: string;
  color: CategoryColor;
  isSelected?: boolean;
}

export default function CategoryChip(props: CategoryChipProps) {
  const dynamicColorClass = categoryColors[props.color];
  const IconComponent = categoryIcons[props.iconName];

  const selectedClass = props.isSelected
    ? "opacity-100 border-solid"
    : "opacity-70 hover:opacity-100";

  if (!IconComponent) {
    console.warn(`Lucide icon '${props.iconName}' not found in mapping.`);
    return (
      <Badge
        variant="outline"
        className={cn(
          "flex justify-center items-center gap-[.35rem] font-semibold rounded-lg active:scale-98 transition-all ease duration-100 border-dashed cursor-pointer",
          selectedClass
        )}
      >
        <span>{props.children}</span>
        {!props.isSelected && <Plus className="size-3 opacity-75" />}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex justify-center items-center gap-[.35rem] font-semibold rounded-lg active:scale-98 transition-all ease duration-100 border-dashed cursor-pointer group",
        selectedClass
      )}
    >
      <IconComponent
        className={cn("h-3 w-3 group-hover:hidden", dynamicColorClass)}
      />
      {props.isSelected && (
        <X className="size-3 opacity-75 hidden group-hover:block" />
      )}
      {!props.isSelected && (
        <Plus className="size-3 opacity-75 hidden group-hover:block" />
      )}
      <span>{props.children}</span>
    </Badge>
  );
}
