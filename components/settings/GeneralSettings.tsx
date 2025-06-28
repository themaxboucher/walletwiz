import { Separator } from "../ui/separator";

export default function GeneralSettings() {
  return (
    <div className="h-full">
      <div className="space-y-0.5 mb-6">
        <h2 className="text-xl font-semibold">General</h2>
        <p className="text-sm text-muted-foreground">
          Configure your account settings, preferences, and privacy options.
        </p>
      </div>

      <h3 className="font-semibold mb-2">Categories</h3>
      <Separator className="mb-4" />
      <h3 className="font-semibold mb-2">Budget</h3>
    </div>
  );
}
