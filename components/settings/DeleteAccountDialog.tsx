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

const deleteSchema = z.object({
  confirm: z.string().refine((val) => val === "DELETE", {
    message: "You must type DELETE to confirm.",
  }),
});

type DeleteFormData = { confirm: string };

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
};

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  onDelete,
}: DeleteAccountDialogProps) {
  const deleteForm = useForm<DeleteFormData>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { confirm: "" },
  });

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
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
