"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { login } from "@/lib/actions/user.actions";
import AuthAlert from "./AuthAlert";

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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        {error && <AuthAlert message={error} type="error" />}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Login"}
        </Button>
      </form>
    </Form>
  );
}
