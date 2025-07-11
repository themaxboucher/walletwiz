"use client";

import { Button } from "../ui/button";
import { TextField } from "../ui/form-fields/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { createAccount, updateAccount } from "@/lib/actions/account.actions";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import FormAlert from "../FormAlert";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { getAccountTypes } from "@/lib/actions/accountType.actions";

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
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          form={form}
          name="name"
          label="Name"
          placeholder="e.g. Edge Preferred Savings"
        />

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={form.watch("type")}
            onValueChange={(value) => form.setValue("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypes.map((type) => (
                <SelectItem key={type.$id} value={type.$id!}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
