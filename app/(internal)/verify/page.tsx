"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { LoaderCircle } from "lucide-react";
import AuthAlert from "@/components/auth/AuthAlert";
import { updateVerification } from "@/lib/appwrite/client";

export default function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
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
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Failed to verify email");
      }
    };

    handleVerification();
  }, [searchParams, router]);

  return (
    <AuthCard
      title="Email Verification"
      description={
        status === "loading"
          ? "Verifying your email..."
          : status === "success"
          ? "Email verified successfully! Redirecting to dashboard..."
          : "Failed to verify email"
      }
    >
      <div className="flex flex-col items-center justify-center gap-4">
        {status === "loading" && (
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        )}

        {status === "error" && (
          <AuthAlert
            message={error ?? "An unknown error occurred."}
            type="error"
          />
        )}

        {status === "success" && (
          <AuthAlert
            message="Email verified successfully! Redirecting to dashboard..."
            type="success"
          />
        )}
      </div>
    </AuthCard>
  );
}
