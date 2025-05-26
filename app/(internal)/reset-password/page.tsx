import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset password"
      description="Enter your new password below."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
