"use client";

import EmailLink from "@/components/auth/EmailLink";
import FormAlert from "@/components/FormAlert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { sendVerificationEmail } from "@/lib/appwrite/client";
import { LoaderCircle, MailCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckEmailPage() {
  const [user, setUser] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getLoggedInUser();
        setUser(user);
      } catch (error) {
        setUserError("Failed to load user information.");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Redirect to dashboard if the user is logged in and has verified their email
  if (user && user.$emailVerification) redirect("/dashboard");

  // If the user is not logged in, redirect to login page
  if (!user) redirect("/login");

  // Add state for loading and success/error message for resending
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleResendEmail = async () => {
    setResending(true);
    setResendStatus("idle");
    try {
      // Use the reusable function to send the verification email
      await sendVerificationEmail();
      setResendStatus("success");
    } catch (error) {
      setResendStatus("error");
      console.error("Failed to resend verification email:", error);
    } finally {
      setResending(false);
    }
  };

  // Show loading state while fetching user
  if (loadingUser) {
    return <LoaderCircle className="text-primary size-8 animate-spin" />;
  }

  // Redirect to home page if user fetch failed
  if (userError || !user) {
    redirect("/");
  }

  return (
    <Card className="mx-auto max-w-md w-full">
      <CardContent className="flex flex-col items-center text-center gap-3">
        <CardHeader className="flex flex-col items-center text-center w-full mb-4 gap-2">
          <div className="rounded-full bg-primary/10 p-3 mb-2">
            <MailCheck className="text-primary size-6" />
          </div>
          <CardTitle className="text-2xl">Confirm your email</CardTitle>
          <CardDescription className="text-center max-w-[25rem]">
            We've sent a verification link to{" "}
            <span className="font-medium">{user.email}</span>. Please click it
            to activate your account.
          </CardDescription>
        </CardHeader>
        <div>
          <EmailLink email={user.email} />
        </div>
        {resendStatus === "success" && (
          <FormAlert message="Verification email sent!" type="success" />
        )}
        {resendStatus === "error" && (
          <FormAlert
            message="Failed to send email. Please try again."
            type="error"
          />
        )}
        <CardFooter className="text-sm text-muted-foreground">
          <p>
            Don't see an email?{" "}
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="link"
            >
              Resend email
            </button>
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
