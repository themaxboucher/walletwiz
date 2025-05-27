"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import AuthAlert from "./AuthAlert";
import { sendPasswordRecoveryEmail } from "@/lib/appwrite/client";
import { TextField } from "../ui/form-fields/TextField";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmitHandler(data: z.infer<typeof formSchema>) {
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      await sendPasswordRecoveryEmail(data.email);
      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      if (errorMessage.includes("rate limit")) {
        setError("Too many attempts. Please try again later");
      } else if (errorMessage.includes("network")) {
        setError("Network error. Please check your connection");
      } else {
        setError("Failed to send recovery email. Please try again.");
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
        <TextField
          form={form}
          name="email"
          label="Email"
          placeholder="you@example.com"
        />
        {error && <AuthAlert message={error} type="error" />}
        {success && (
          <AuthAlert
            message="Recovery email sent! Please check your inbox."
            type="success"
          />
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Send recovery email"}
        </Button>
      </form>
    </Form>
  );
}
