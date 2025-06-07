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
import EmailLink from "@/components/auth/EmailLink";
import { MailCheck } from "lucide-react";
import { sendVerificationEmail } from "@/lib/appwrite/client";
import FormAlert from "../FormAlert";

interface EmailVerificationDialogProps {
  user: User;
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
          <MailCheck className="text-primary size-8 m-4" />
          <DialogTitle>
            Check your inbox to confirm your email address
          </DialogTitle>
          <DialogDescription className="text-center max-w-[25rem]">
            We sent an email to{" "}
            <span className="font-medium">{user.email}</span>. Click the link in
            the email to verify your account.
          </DialogDescription>
        </DialogHeader>
        <div>
          <EmailLink email={user?.email} />
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
        <DialogFooter className="text-sm text-muted-foreground">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
