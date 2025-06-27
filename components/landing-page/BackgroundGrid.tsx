import { cn } from "@/lib/utils";

interface BackgroundGridProps {
  className?: string;
}

export default function BackgroundGrid({ className }: BackgroundGridProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full -z-3 opacity-50",
        "[background-size:25px_25px]",
        "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
        "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        className
      )}
    />
  );
}
