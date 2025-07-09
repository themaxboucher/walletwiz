import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { useState } from "react";
import { PasswordField } from "../ui/form-fields/PasswordField";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { updatePassword } from "@/lib/appwrite/client";
import { toast } from "sonner";

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit(data: UpdatePasswordFormData) {
    setLoading(true);
    try {
      await updatePassword(data.newPassword, data.currentPassword);
      toast("Password updated successfully", {
        icon: <CircleCheck className="text-primary size-5" />,
      });
      form.reset();
    } catch (error: any) {
      let errorMessage = "Error updating password";
      if (
        error?.message?.includes("Invalid credentials") ||
        error?.message?.includes("Invalid `oldPassword` param")
      ) {
        errorMessage = "The current password you entered is incorrect";
      }
      toast(errorMessage, {
        icon: <CircleX className="text-destructive size-5" />,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4 max-w-sm"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <PasswordField
          form={form}
          name="currentPassword"
          label="Current password"
          placeholder="••••••••••••"
        />
        <PasswordField
          form={form}
          name="newPassword"
          label="New password"
          placeholder="••••••••••••"
        />
        <Button type="submit" className="mt-2" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Update password"}
        </Button>
      </form>
    </Form>
  );
}
