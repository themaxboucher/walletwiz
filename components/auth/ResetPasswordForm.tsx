"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import AuthAlert from "./AuthAlert";
import { resetPassword } from "@/lib/appwrite/client";
import { useSearchParams, useRouter } from "next/navigation";
import { PasswordField } from "../ui/form-fields/PasswordField";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Must be 8 or more characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmitHandler(data: z.infer<typeof formSchema>) {
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      const userId = searchParams.get("userId");
      const secret = searchParams.get("secret");

      if (!userId || !secret) {
        throw new Error("Invalid reset link");
      }

      await resetPassword(userId, secret, data.password);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      if (errorMessage.includes("Invalid reset link")) {
        setError("Invalid or expired reset link. Please request a new one.");
      } else if (errorMessage.includes("rate limit")) {
        setError("Too many attempts. Please try again later");
      } else if (errorMessage.includes("network")) {
        setError("Network error. Please check your connection");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <PasswordField form={form} name="password" label="New Password" />
        <PasswordField
          form={form}
          name="confirmPassword"
          label="Confirm Password"
        />
        {error && <AuthAlert message={error} type="error" />}
        {success && (
          <AuthAlert
            message="Password reset successful! Redirecting to login..."
            type="success"
          />
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Reset password"}
        </Button>
      </form>
    </Form>
  );
}
