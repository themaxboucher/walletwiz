import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import React from "react";

interface EmptyStateProps {
  onAddClick: () => void;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
}

export default function EmptyState({
  onAddClick,
  icon,
  title,
  description,
  buttonText,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="rounded-full bg-primary/10 p-3 mb-4">{icon}</div>
      <h3 className=" font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-64 text-sm">
        {description}
      </p>
      <Button onClick={onAddClick}>
        <Plus className="size-4" />
        <span>{buttonText}</span>
      </Button>
    </div>
  );
}
