"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import Link from "next/link";
import { login } from "@/lib/actions/user.actions";
import FormAlert from "../FormAlert";
import { TextField } from "../ui/form-fields/TextField";
import { PasswordField } from "../ui/form-fields/PasswordField";
import { createClientSession } from "@/lib/appwrite/client";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmitHandler(data: z.infer<typeof formSchema>) {
    setError(null);
    setLoading(true);

    try {
      const result = await login(data);

      if (!result) {
        throw new Error("Failed to login");
      }
      // Create Appwrite client session in the browser
      await createClientSession(data.email, data.password);
      toast(
        <span className="block max-w-xs overflow-hidden text-ellipsis whitespace-nowrap align-middle">{`Logged in as ${data.email}`}</span>,
        {
          icon: <CircleCheck className="text-primary size-5" />,
        }
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      // Handle specific error cases
      if (errorMessage.includes("Invalid credentials")) {
        setError("Invalid email or password");
      } else if (errorMessage.includes("rate limit")) {
        setError("Too many attempts. Please try again later");
      } else if (errorMessage.includes("network")) {
        setError("Network error. Please check your connection");
      } else {
        setError(errorMessage);
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
          placeholder="tylerdurden@gmail.com"
        />
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium">Password</label>
            <Link
              href="/forgot-password"
              className="ml-auto inline-block text-sm link"
            >
              Forgot your password?
            </Link>
          </div>
          <PasswordField form={form} name="password" label="" />
        </div>
        {error && <FormAlert message={error} type="error" />}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Login"}
        </Button>
      </form>
    </Form>
  );
}
