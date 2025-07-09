import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useRef } from "react";
import { TextField } from "../ui/form-fields/TextField";
import { Label } from "../ui/label";
import {
  CircleCheck,
  CircleX,
  LoaderCircle,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { updateUser } from "@/lib/actions/user.actions";
import { uploadAvatar, deleteAvatar } from "@/lib/appwrite/client";
import { toast } from "sonner";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      avatar: user.avatar || undefined,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    },
  });

  const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB
  const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg"];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
        toast("Only PNG and JPG images are allowed", {
          icon: <CircleX className="text-destructive size-5" />,
        });
        return;
      }
      if (file.size > MAX_AVATAR_SIZE) {
        toast("Avatar must be under 2 MB", {
          icon: <CircleX className="text-destructive size-5" />,
        });
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
        form.setValue("avatar", ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const userInitials = (user.firstName[0] + user.lastName[0]).toUpperCase();

  async function onSubmit(data: PersonalDetailsFormData) {
    setLoading(true);
    try {
      let avatarUrl;
      let oldAvatarFileId: string | null = null;
      if (user.avatar) {
        // Extract fileId from the old avatar URL
        const match = user.avatar.match(/files\/([^/]+)\/preview/);
        if (match) {
          oldAvatarFileId = match[1];
        }
      }
      if (avatarFile) {
        // Upload new avatar
        avatarUrl = await uploadAvatar(avatarFile);
        // Delete old avatar if it exists
        if (oldAvatarFileId) {
          try {
            await deleteAvatar(oldAvatarFileId);
          } catch (error) {
            console.error("Failed to delete old avatar:", error);
          }
        }
      }
      await updateUser({
        userId: user.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        avatar: avatarUrl,
      });
      toast("Personal details updated successfully", {
        icon: <CircleCheck className="text-primary size-5" />,
      });
    } catch (error: any) {
      let errorMessage = "Error updating personal details";
      if (error?.message?.includes("already exists")) {
        errorMessage = "An account with this email already exists";
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
              accept="image/png, image/jpeg"
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
        <div>
          <TextField
            form={form}
            name="email"
            label="Email"
            placeholder="Email"
            description={
              !user.$emailVerification ? (
                <span className="flex items-center text-yellow-600 text-xs font-medium">
                  <AlertCircle className="size-3 mr-1" />
                  Email not verified
                </span>
              ) : undefined
            }
          />
        </div>

        <Button type="submit" disabled={loading} className="mt-2">
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
