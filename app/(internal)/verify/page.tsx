"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircleCheck, LoaderCircle } from "lucide-react";
import FormAlert from "@/components/FormAlert";
import { updateVerification } from "@/lib/appwrite/client";
import { toast } from "sonner";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Common Appwrite error patterns
    if (message.includes("invalid") && message.includes("secret")) {
      return "This verification link has expired or is invalid. Please request a new verification email.";
    }

    if (message.includes("already verified")) {
      return "Your email has already been verified. You can now log in to your account.";
    }

    if (message.includes("user not found")) {
      return "This verification link is invalid. Please check your email or request a new verification link.";
    }

    if (message.includes("network") || message.includes("connection")) {
      return "Unable to connect to our servers. Please check your internet connection and try again.";
    }

    if (message.includes("timeout")) {
      return "The verification request timed out. Please try again.";
    }

    // Generic error messages for common scenarios
    if (message.includes("invalid verification link")) {
      return "This verification link is invalid or has expired. Please request a new verification email from your account settings.";
    }
  }

  return "An unexpected error occurred while verifying your email. Please try again or contact support if the problem persists.";
}

// Separate component that uses useSearchParams() - must be wrapped in Suspense
// This is required in Next.js 15 to handle client-side rendering bailout properly
function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // This hook requires Suspense boundary
  const router = useRouter();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const userId = searchParams.get("userId");
        const secret = searchParams.get("secret");

        if (!userId || !secret) {
          throw new Error("Invalid verification link");
        }

        await updateVerification(userId, secret);
        setStatus("success");
        router.refresh(); // Potential fix to "already verified" bug
        toast("Email verified successfully!", {
          icon: <CircleCheck className="text-primary size-5" />,
        });
        router.push("/onboarding/accounts");
      } catch (err) {
        setStatus("error");
        setError(getErrorMessage(err));
      }
    };

    handleVerification();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {(status === "loading" || status === "success") && (
        <LoaderCircle className="size-8 animate-spin text-primary" />
      )}

      {status === "error" && (
        <div className="max-w-md w-full">
          <FormAlert
            message={error ?? "An unknown error occurred."}
            type="error"
          />
        </div>
      )}
    </div>
  );
}

// Main component that wraps VerifyContent in Suspense boundary
// This is required in Next.js 15 when using useSearchParams() to prevent build errors
export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center gap-4">
          <LoaderCircle className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
