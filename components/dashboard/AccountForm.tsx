"use client";

import { Button } from "../ui/button";
import { TextField } from "../ui/form-fields/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { createAccount, updateAccount } from "@/lib/actions/account.actions";
import { CircleX, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import FormAlert from "../FormAlert";
import { useRouter } from "next/navigation";
import { SelectField } from "../ui/form-fields/SelectField";
import { getAccountTypes } from "@/lib/actions/accountType.actions";
import { toast } from "sonner";
import { accountTypeIcons } from "@/constants";

// Define the Zod schema for the account form
const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Account name is required" })
    .max(50, { message: "Account name is too long" }),
  type: z.string().min(1, { message: "Type is required" }),
});

type AccountFormData = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
  accountToEdit?: Account | null;
  onCancel: () => void;
  userId: string;
}

export default function AccountForm({
  accountToEdit,
  onCancel,
  userId,
}: AccountFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);

  useEffect(() => {
    async function fetchAccountTypes() {
      try {
        const types = await getAccountTypes();
        setAccountTypes(types);
      } catch (e) {
        setAccountTypes([]);
      }
    }
    fetchAccountTypes();
  }, []);

  // Group labels for account types
  const accountTypeGroupLabels: Record<string, string> = {
    depository: "Depository",
    credit: "Credit",
    other: "Other",
  };

  const accountTypeOptions = accountTypes.map((type) => ({
    value: type.$id!,
    label: type.name,
    icon: accountTypeIcons[type.iconName],
    group: accountTypeGroupLabels[type.type] || "Other",
  }));

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: accountToEdit
      ? {
          name: accountToEdit.name,
          type: accountToEdit.type?.$id ?? "",
        }
      : {
          name: "",
          type: "",
        },
  });

  async function onSubmit(values: AccountFormData) {
    setError(null);
    setLoading(true);

    try {
      const accountData = {
        name: values.name,
        type: values.type, // AccountType $id string
      };

      if (accountToEdit?.$id) {
        await updateAccount(String(accountToEdit.$id), accountData);
      } else {
        await createAccount(accountData, userId);
      }

      router.refresh();
      onCancel();
    } catch (error) {
      console.error("Error saving account:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save account"
      );
      toast("Error saving account", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            form={form}
            name="name"
            label="Name"
            placeholder="e.g. Edge Savings"
          />

          <SelectField
            form={form}
            name="type"
            label="Type"
            options={accountTypeOptions}
            placeholder="Select account type"
          />
        </div>

        {error && <FormAlert message={error} type="error" />}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {!loading && "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
