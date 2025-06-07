"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { signup } from "@/lib/actions/user.actions";
import FormAlert from "../FormAlert";
import { sendVerificationEmail } from "@/lib/appwrite/client";
import { TextField } from "../ui/form-fields/TextField";
import { PasswordField } from "../ui/form-fields/PasswordField";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, {
    message: "Must be 8 or more characters long",
  }),
});

type SignupFormData = z.infer<typeof formSchema>;

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmitHandler(data: SignupFormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await signup(data);

      if (!result) {
        throw new Error("Failed to create account");
      }

      // Send verification email
      await sendVerificationEmail();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      // Handle specific error cases
      if (errorMessage.includes("already exists")) {
        setError("An account with this email already exists");
      } else if (errorMessage.includes("password")) {
        setError("Password must be at least 6 characters long");
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            form={form}
            name="firstName"
            label="First Name"
            placeholder="Tony"
          />
          <TextField
            form={form}
            name="lastName"
            label="Last Name"
            placeholder="Stark"
          />
        </div>
        <TextField
          form={form}
          name="email"
          label="Email"
          placeholder="tony@starkindustries.com"
        />
        <PasswordField form={form} name="password" label="Password" />
        {error && <FormAlert message={error} type="error" />}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Create an account"}
        </Button>
      </form>
    </Form>
  );
}
