import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { cn } from "@/lib/utils";

type AlertType = "error" | "success";

interface FormAlertProps {
  message: string;
  type?: AlertType;
}

export default function FormAlert({ message, type = "error" }: FormAlertProps) {
  const isError = type === "error";

  return (
    <Alert
      variant={isError ? "destructive" : "default"}
      className={cn(
        "flex items-center justify-center gap-2",
        isError
          ? "bg-destructive/5 border-destructive/50"
          : "bg-primary/5 border-primary/50"
      )}
    >
      <span>
        {isError ? (
          <AlertCircle className="size-4" />
        ) : (
          <CheckCircle2 className="size-4 text-primary" />
        )}
      </span>
      <AlertDescription
        className={cn("font-semibold text-xs", !isError && "text-primary")}
      >
        {message}
      </AlertDescription>
    </Alert>
  );
}
