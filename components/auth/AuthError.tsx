import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export default function AuthError(props: { message: string }) {
  return (
    <Alert
      variant="destructive"
      className="flex items-center justify-center gap-2 bg-destructive/5 border-destructive/50"
    >
      <span>
        <AlertCircle className="size-4" />
      </span>
      <AlertDescription className="font-semibold text-xs">
        {props.message}
      </AlertDescription>
    </Alert>
  );
}
