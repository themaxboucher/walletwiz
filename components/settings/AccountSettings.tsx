import { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import PersonalDetailsForm from "./PersonalDetailsForm";

interface AccountSettingsProps {
  user: User;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  // Form state for password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password updated (not implemented)");
  };

  return (
    <div className="h-full">
      <div className="space-y-0.5 mb-6">
        <h2 className="text-xl font-semibold">Account</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and security settings.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="mb-8 max-w-md">
        <h3 className="font-semibold mb-4">Personal Information</h3>
        <PersonalDetailsForm user={user} />
      </div>
      <Separator className="my-4" />
      <form className="mb-8" onSubmit={handlePasswordSubmit}>
        <h3 className="font-semibold mb-4">Security</h3>
        <div className="flex flex-col gap-2 max-w-md">
          <Input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" size="sm" className="mt-2">
          Update password
        </Button>
      </form>
      <Separator className="my-4" />
      <div>
        <div className="space-y-1">
          <h3 className="font-semibold">Delete your account</h3>
          <p className="text-sm text-muted-foreground">
            This action is irreversible. All of your data will be permanently
            and irreversibly deleted.
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="mt-4 mb-6"
          onClick={() => alert("Account deletion is not implemented yet.")}
        >
          Delete account
        </Button>
      </div>
    </div>
  );
}
