"use client";

import { Button } from "../ui/button";
import { TextField } from "../ui/form-fields/TextField";
import { NumberField } from "../ui/form-fields/NumberField";
import { InstitutionField } from "../ui/form-fields/InstitutionField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { createAccount } from "@/lib/actions/account.actions";
import { createBrandfetchIconUrl } from "@/lib/utils";
import { CircleX, Info, LoaderCircle, Plus } from "lucide-react";
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
  userId: string;
  onAdd: (account: Account) => void;
}

export default function AccountsOnboardingForm({
  userId,
  onAdd,
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
    imageSrc: type.brandDomain
      ? createBrandfetchIconUrl(type.brandDomain, 18)
      : undefined,
    group: accountTypeGroupLabels[type.type] || "Other",
  }));

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
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

      const createdAccount = await createAccount(accountData, userId);

      // Update an accounts state
      onAdd(createdAccount);

      // Reset form fields
      form.reset();
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
          placeholder="e.g. Gringotts Advantage"
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
          description={
            <span className="flex items-center">
              <Info className="size-3 mr-1" />
              Updates automatically with new transactions
            </span>
          }
        />

        {error && <FormAlert message={error} type="error" />}
        <div className="flex justify-between mt-4">
          <Button type="submit" size="sm" className="w-full" disabled={loading}>
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {!loading && (
              <>
                <Plus className="size-3.5 opacity-75" />
                <span>Add</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
