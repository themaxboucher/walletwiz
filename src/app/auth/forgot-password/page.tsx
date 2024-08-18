import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot password</CardTitle>
        <CardDescription>
          Enter the email associated with your account and we'll send you a link
          to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link href="/auth/signup" className="underline">
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
