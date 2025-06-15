import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { cn } from "@/lib/utils";

type AlertType = "error" | "success" | "info";

interface FormAlertProps {
  message: string;
  type?: AlertType;
}

export default function FormAlert({ message, type = "error" }: FormAlertProps) {
  const isError = type === "error";
  const isInfo = type === "info";

  return (
    <Alert
      variant={isError ? "destructive" : "default"}
      className={cn(
        "flex items-center justify-center gap-2",
        isError
          ? "bg-destructive/5 border-destructive/50"
          : isInfo
          ? "bg-blue-500/5 border-blue-500/50"
          : "bg-primary/5 border-primary/50"
      )}
    >
      <span>
        {isError ? (
          <AlertCircle className="size-4" />
        ) : isInfo ? (
          <Info className="size-4 text-blue-500" />
        ) : (
          <CheckCircle2 className="size-4 text-primary" />
        )}
      </span>
      <AlertDescription
        className={cn(
          "font-semibold text-xs",
          isError
            ? "text-destructive"
            : isInfo
            ? "text-blue-500"
            : "text-primary"
        )}
      >
        {message}
      </AlertDescription>
    </Alert>
  );
}
