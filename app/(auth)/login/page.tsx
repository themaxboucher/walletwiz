import AuthCard from "@/components/auth/AuthCard";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
export default function LoginPage() {
  return (
    <AuthCard title="Login" description="Enter your information to login.">
      <LoginForm />
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </AuthCard>
  );
}
