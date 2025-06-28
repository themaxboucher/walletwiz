import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useRef } from "react";
import { TextField } from "../ui/form-fields/TextField";
import { Label } from "../ui/label";
import { LoaderCircle } from "lucide-react";
import { updateUser } from "@/lib/actions/user.actions";

const personalDetailsSchema = z.object({
  avatar: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;

export default function PersonalDetailsForm({ user }: { user: User }) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar || null
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      avatar: user.avatar || undefined,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
        form.setValue("avatar", ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const userInitials = (user.firstName[0] + user.lastName[0]).toUpperCase();

  async function onSubmit(data: PersonalDetailsFormData) {
    console.log("Form submitted with data:", data);
    // setLoading(true);
    // setSuccess(null);
    // setError(null);
    // try {
    //   await updateUser({
    //     userId: user.userId || user.$id,
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     email: data.email,
    //     avatar: data.avatar,
    //   });
    //   setSuccess("Profile updated successfully.");
    // } catch (err: any) {
    //   setError(err?.message || "Failed to update profile");
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-sm"
      >
        <div className="space-y-2">
          <Label>Your avatar</Label>
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="size-12 border border-border">
              <AvatarImage
                className="object-cover shadow-inner"
                src={avatarPreview || undefined}
              />
              <AvatarFallback className="font-bold text-primary bg-primary/20">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Pick an image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            form={form}
            name="firstName"
            label="First name"
            placeholder="First name"
          />
          <TextField
            form={form}
            name="lastName"
            label="Last name"
            placeholder="Last name"
          />
        </div>
        <TextField form={form} name="email" label="Email" placeholder="Email" />

        <Button type="submit" disabled={loading}>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
