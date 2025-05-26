"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EmailLink from "@/components/auth/EmailLink";
import { LoaderCircle, MailCheck, Send } from "lucide-react";
import { sendVerificationEmail } from "@/lib/appwrite/client";
import AuthAlert from "./AuthAlert";

interface EmailVerificationDialogProps {
  user: any; // Replace 'any' with your actual user type
}

export default function EmailVerificationDialog({
  user,
}: EmailVerificationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Add state for loading and success/error message for resending
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Open the dialog if the user is logged in but not verified
  useEffect(() => {
    if (user && !user.$emailVerification) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  // If not open, don't render anything
  if (!isOpen) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex flex-col items-center text-center">
        <DialogClose /> {/* Standard close button */}
        <DialogHeader className="flex flex-col items-center text-center">
          <MailCheck className="text-primary size-6 m-4" />
          <DialogTitle>
            Check your inbox to confirm your email address
          </DialogTitle>
          <DialogDescription className="text-center">
            We sent a temporary verification link to{" "}
            <span className="font-medium">{user.email}</span>. If you don't see
            it, check your spam folder. After confirming your email you can
            explore the platform.
          </DialogDescription>
        </DialogHeader>
        {/* <div>
          <EmailLink email={user?.email} />
        </div> */}
        <Button onClick={handleResendEmail} disabled={resending}>
          {resending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              Resend email
            </>
          )}
        </Button>
        {resendStatus === "success" && (
          <AuthAlert message="Verification email sent!" type="success" />
        )}
        {resendStatus === "error" && (
          <AuthAlert
            message="Failed to send email. Please try again."
            type="error"
          />
        )}
        <DialogFooter>
          <p className="text-sm">
            Didn't get the email? If not, check your spam folder.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
