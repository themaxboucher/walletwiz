"use client";

import { Button } from "../ui/button";
import { TextField } from "../ui/form-fields/TextField";
import { NumberField } from "../ui/form-fields/NumberField";
import { InstitutionField } from "../ui/form-fields/InstitutionField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { createAccount, updateAccount } from "@/lib/actions/account.actions";
import { createBrandfetchIconUrl } from "@/lib/utils";
import { CircleX, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import FormAlert from "../FormAlert";
import { useRouter } from "next/navigation";
import { SelectField } from "../ui/form-fields/SelectField";
import { getAccountTypes } from "@/lib/actions/accountType.actions";
import { toast } from "sonner";
import { accountTypeIcons } from "@/constants";
import DeleteAccountDialog from "./DeleteAccountDialog";

// Define the Zod schema for the account form
const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Account name is required" })
    .max(50, { message: "Account name is too long" }),
  institution: z
    .object({
      value: z.string(), // institution name for new, $id for existing
      label: z.string(), // institution name
      domain: z.string(),
      id: z.string().optional(), // Appwrite institution document ID for existing institutions
    })
    .optional()
    .nullable(),
  type: z.string().min(1, { message: "Type is required" }),
  currentBalance: z.number().optional(),
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

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
    imageSrc: type.brandDomain
      ? createBrandfetchIconUrl(type.brandDomain, 18)
      : undefined,
    group: accountTypeGroupLabels[type.type] || "Other",
  }));

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: accountToEdit
      ? {
          name: accountToEdit.name,
          institution: accountToEdit.institution
            ? {
                value: accountToEdit.institution.$id!,
                label: accountToEdit.institution.name,
                domain: accountToEdit.institution.domain,
                id: accountToEdit.institution.$id!,
              }
            : null,
          type: accountToEdit.type?.$id ?? "",
          currentBalance: accountToEdit.currentBalance || undefined,
        }
      : {
          name: "",
          institution: null,
          type: "",
          currentBalance: undefined,
        },
  });

  async function onSubmit(values: AccountFormData) {
    setError(null);
    setLoading(true);

    try {
      let institutionField;
      if (values.institution?.id) {
        // Previous institution: use the Appwrite institution document ID
        institutionField = values.institution.id;
      } else if (values.institution) {
        // New institution: construct the institution object
        institutionField = {
          name: values.institution.label,
          domain: values.institution.domain || "",
        };
      }

      const accountData = {
        name: values.name,
        institution: institutionField,
        type: values.type, // AccountType $id string
        currentBalance: values.currentBalance || undefined,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TextField
          form={form}
          name="name"
          label="Name"
          placeholder="e.g. RBC Advantage Banking"
        />

        <div className="grid grid-cols-2 gap-4">
          <InstitutionField
            form={form}
            name="institution"
            label="Institution"
            placeholder="Select institution"
          />
          <SelectField
            form={form}
            name="type"
            label="Type"
            options={accountTypeOptions}
            placeholder="Select account type"
          />
        </div>

        <NumberField
          form={form}
          name="currentBalance"
          label="Current Balance"
          placeholder="0.00"
          isCurrency={true}
        />

        {error && <FormAlert message={error} type="error" />}
        <div className="flex justify-between mt-4">
          {accountToEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          )}
          <div className={`flex gap-2 ${!accountToEdit ? "ml-auto" : ""}`}>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {!loading && "Save"}
            </Button>
          </div>
        </div>
      </form>

      {accountToEdit && (
        <DeleteAccountDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          accountId={accountToEdit.$id!}
          onAccountDeleted={onCancel}
        />
      )}
    </Form>
  );
}
