import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import PersonalDetailsForm from "./PersonalDetailsForm";
import UpdatePasswordForm from "./UpdatePasswordForm";

interface AccountSettingsProps {
  user: User;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
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
      <div className="mb-8 max-w-md">
        <h3 className="font-semibold mb-4">Security</h3>
        <UpdatePasswordForm />
      </div>
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
