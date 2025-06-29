import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "../ui/form-fields/TextField";
import { toast } from "sonner";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { deleteAccount } from "@/lib/actions/user.actions";
import { logout } from "@/lib/actions/user.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

const deleteSchema = z.object({
  confirm: z.string().refine((val) => val === "DELETE", {
    message: "You must type DELETE to confirm.",
  }),
});

type DeleteFormData = { confirm: string };

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
};

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  user,
}: DeleteAccountDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const deleteForm = useForm<DeleteFormData>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { confirm: "" },
  });

  async function onDelete() {
    setLoading(true);
    try {
      const authUserId = user.userId;
      const docUserId = user.$id;
      await deleteAccount(authUserId, docUserId);
      toast("Account deleted successfully", {
        icon: <CircleCheck className="text-primary size-5" />,
      });
      await logout();
      router.push("/");
    } catch (error) {
      toast("Error deleting account", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle>
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and all associated data. Please type{" "}
            <span className="font-semibold">DELETE</span> to confirm:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...deleteForm}>
          <form
            onSubmit={deleteForm.handleSubmit(onDelete)}
            className="space-y-4"
          >
            <TextField
              form={deleteForm}
              name="confirm"
              placeholder="DELETE"
              variant="destructive"
            />

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-destructive hover:bg-destructive/90"
                disabled={!deleteForm.formState.isValid}
              >
                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {!loading && "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
