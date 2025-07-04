import { Separator } from "../ui/separator";
import CategoriesForm from "./CategoriesForm";

interface CategoriesSettingsProps {
  user: User;
}

export default function CategoriesSettings({ user }: CategoriesSettingsProps) {
  return (
    <div className="h-full">
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-semibold">Categories</h2>
        <p className="text-sm text-muted-foreground">
          Select the categories you want to use for your transactions.
        </p>
      </div>
      <Separator className="my-4" />

      <CategoriesForm user={user} />
    </div>
  );
}
