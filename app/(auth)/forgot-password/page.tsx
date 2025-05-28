import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot password"
      description="Enter the email associated with your account and we'll send you a link
          to reset your password."
    >
      <ForgotPasswordForm />
      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="link">
          Back to login
        </Link>
      </div>
    </AuthCard>
  );
}
