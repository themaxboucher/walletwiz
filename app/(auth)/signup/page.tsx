import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";
export default function SignupPage() {
  return (
    <AuthCard
      title="Sign Up"
      description="Enter your information to create an account."
    >
      <SignupForm />
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
}
