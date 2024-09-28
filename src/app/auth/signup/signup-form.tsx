"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { signup } from "@/app/auth/actions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { AlertCircle, LoaderCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, {
    message: "Must be 6 or more characters long",
  }),
});

export default function SignupForm() {
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
    setError(null); // Reset error before submitting
    setLoading(true); // Disable sumbit button

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signup(formData);
    setLoading(false); // Re-enable sumbit button
    if (result?.error) {
      setError(result.error); // Set error message if signup fails
    }
  }
  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        {/*
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Tony" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Stark" required />
          </div>
        </div>
         */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="tony@starkindustries.com" {...field} />
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
              <FormLabel>Password</FormLabel>

              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        {error && (
          <Alert
            variant="destructive"
            className="flex items-center justify-center gap-2"
          >
            <span>
              <AlertCircle className="size-4" />
            </span>
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Create an account"}
        </Button>
        <Button variant="outline" className="w-full">
          <FcGoogle className="mr-2 h-4 w-4" />
          Sign up with Google
        </Button>
      </form>
    </Form>
  );
}
