"use client";

import { Button } from "../ui/button";
import { NumberField } from "../ui/form-fields/NumberField";
import { DateField } from "../ui/form-fields/DateField";
import { TextareaField } from "../ui/form-fields/TextareaField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { categoryIcons, categoryColors, accountTypeIcons } from "@/constants";
import { getAccountIcon, createBrandfetchIconUrl } from "@/lib/utils";
import {
  createTransaction,
  updateTransaction,
} from "@/lib/actions/transaction.actions";
import { CircleX, LoaderCircle, Landmark } from "lucide-react";
import { useState, useEffect } from "react";
import FormAlert from "../FormAlert";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SelectField } from "../ui/form-fields/SelectField";
import { PayeeField } from "../ui/form-fields/PayeeField";

// Define the Zod schema for the transaction form
const transactionFormSchema = z.object({
  payee: z.object({
    value: z.string(), // brandId
    label: z.string(), // name
    domain: z.string().optional().nullable(),
    id: z.string().optional(), // Appwrite payee document ID for previous payees
    defaultCategoryId: z.string().optional().nullable(),
  }),
  amount: z.coerce.number(),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.date({ required_error: "Date is required" }),
  notes: z.string().max(300, { message: "Note is too long" }).optional(),
  account: z.string().min(1, { message: "Account is required" }),
});

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  transactionToEdit?: Transaction | null;
  onCancel: () => void;
  categories: Category[];
  accounts: Account[];
}

export default function TransactionForm({
  transactionToEdit,
  onCancel,
  categories,
  accounts,
}: TransactionFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Refine schema dynamically using the categories prop
  const refinedTransactionFormSchema = transactionFormSchema.superRefine(
    (data, ctx) => {
      const category = categories.find(
        (cat: Category) => cat.name === data.category
      );
      if (!category) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid category selected",
          path: ["category"],
        });
        return;
      }

      if (category.type === "income" && data.amount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${category.name} amount must be positive`,
          path: ["amount"],
        });
      } else if (category.type === "expense" && data.amount >= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${category.name} amount must be negative`,
          path: ["amount"],
        });
      } else if (category.type === "transfer" && data.amount === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${category.name} amount cannot be zero`,
          path: ["amount"],
        });
      }
    }
  );

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(refinedTransactionFormSchema),
    defaultValues: transactionToEdit
      ? {
          payee: transactionToEdit.payee
            ? {
                value: transactionToEdit.payee.brandId || "",
                label: transactionToEdit.payee.name,
                domain: transactionToEdit.payee.domain,
                id: transactionToEdit.payee.$id,
              }
            : undefined,
          amount: transactionToEdit.amount,
          category: transactionToEdit.category.name,
          date: new Date(transactionToEdit.date),
          notes: transactionToEdit.note,
          account: transactionToEdit.account?.$id ?? "",
        }
      : {
          payee: undefined,
          amount: undefined,
          category: "",
          date: undefined,
          notes: "",
          account: "",
        },
  });

  // Watch category and amount fields
  const watchedCategory = form.watch("category");
  const watchedAmount = form.watch("amount");
  const watchedPayee = form.watch("payee");

  // Automatically format the amount field based on the selected category type
  // If the category is an expense, ensure the amount is negative
  // If the category is not an expense, ensure the amount is positive
  useEffect(() => {
    if (
      !watchedCategory ||
      watchedAmount === undefined ||
      watchedAmount === null ||
      isNaN(Number(watchedAmount))
    )
      return;
    const selectedCategory = categories.find(
      (cat) => cat.name === watchedCategory
    );
    if (!selectedCategory) return;
    if (selectedCategory.type === "expense" && Number(watchedAmount) > 0) {
      // Convert to negative for expenses
      form.setValue("amount", -Math.abs(Number(watchedAmount)), {
        shouldValidate: true,
      });
    } else if (
      selectedCategory.type === "income" &&
      Number(watchedAmount) < 0
    ) {
      // Convert to positive for income
      form.setValue("amount", Math.abs(Number(watchedAmount)), {
        shouldValidate: true,
      });
    }
    // For transfer type, allow both positive and negative amounts without auto-formatting
  }, [watchedCategory, watchedAmount, categories, form]);

  // When a payee is selected, auto-set the category to the payee's default category (if present)
  useEffect(() => {
    if (!watchedPayee || !watchedPayee.defaultCategoryId) return;
    const defaultCategoryId = watchedPayee.defaultCategoryId as string;
    const defaultCategory = categories.find(
      (cat) => cat.$id === defaultCategoryId
    );
    if (!defaultCategory) return;
    const defaultCategoryName = defaultCategory.name;
    if (form.getValues("category") !== defaultCategoryName) {
      form.setValue("category", defaultCategoryName, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [watchedPayee, categories, form]);

  // Get the users ID from the first category
  const userId = categories[0]?.user?.$id;
  if (!userId) throw new Error("User not found");

  async function onSubmit(values: TransactionFormData) {
    console.log("Submitting transaction form with values:", values);
    setError(null);
    setLoading(true);
    console.log("Submitting transaction form with values:", values);
    try {
      const selectedCategory = categories.find(
        (cat: Category) => cat.name === values.category
      );
      if (!selectedCategory || !selectedCategory.$id)
        throw new Error("Category not found");

      let payeeField;
      if (values.payee?.id) {
        // Previous payee: use the Appwrite payee document ID
        payeeField = values.payee.id;
      } else {
        // New payee: construct the payee object
        payeeField = {
          name: values.payee?.label,
          brandId: values.payee?.value,
          domain: values.payee?.domain,
          defaultCategory: selectedCategory.$id,
          user: userId,
        } as PayeeDB;
      }

      const transactionData = {
        payee: payeeField,
        amount: Number(values.amount.toFixed(2)),
        category: selectedCategory.$id,
        date: values.date.toISOString(),
        note: values.notes,
        user: userId,
        account: values.account,
      } as TransactionDB;

      if (transactionToEdit?.$id) {
        await updateTransaction(String(transactionToEdit.$id), transactionData);
      } else {
        await createTransaction(transactionData);
      }

      router.refresh();
      onCancel();
    } catch (error) {
      console.error("Error saving transaction:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save transaction"
      );
      toast("Error saving transaction", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    } finally {
      setLoading(false);
    }
  }

  const categoryOptions = categories
    .map((cat: Category) => ({
      value: cat.name,
      label: cat.name,
      icon: cat.iconName ? categoryIcons[cat.iconName] : undefined,
      color: cat.color ? categoryColors[cat.color] : undefined,
      group:
        cat.type === "income"
          ? "Income"
          : cat.type === "expense"
          ? "Expense"
          : cat.type === "transfer"
          ? "Transfer"
          : undefined,
    }))
    .sort((a, b) => {
      if (a.group === b.group) return 0;
      if (a.group === "Income") return -1;
      if (b.group === "Income") return 1;
      if (a.group === "Transfer") return 1;
      if (b.group === "Transfer") return -1;
      return 0;
    });

  const accountOptions = accounts.map((account) => {
    const iconResult = getAccountIcon(account);

    if (iconResult.type === "brandfetch") {
      return {
        value: account.$id!,
        label: account.name,
        imageSrc: createBrandfetchIconUrl(iconResult.value, 18),
      };
    } else {
      // Handle Lucide icon
      const Icon =
        iconResult.value === "Landmark"
          ? Landmark
          : accountTypeIcons[iconResult.value];
      return {
        value: account.$id!,
        label: account.name,
        icon: Icon,
      };
    }
  });

  if (categories.length === 0) {
    return (
      <FormAlert
        message="No categories available. Please add categories to create transactions."
        type="info"
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <PayeeField
            form={form}
            name="payee"
            userId={userId}
            placeholder="Select payee"
          />
          <SelectField
            form={form}
            name="category"
            label="Category"
            options={categoryOptions}
            placeholder="Select category"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            form={form}
            name="amount"
            label="Amount"
            placeholder="0.00"
            step="0.01"
            min={0.01}
            isCurrency={true}
          />
          <SelectField
            form={form}
            name="account"
            label="Account"
            options={accountOptions}
            placeholder="Select account"
          />
        </div>
        <DateField
          form={form}
          name="date"
          label="Date"
          minDate={new Date("1900-01-01")}
        />

        <TextareaField
          form={form}
          name="notes"
          label="Notes"
          placeholder="Write a note here..."
        />

        {error && <FormAlert message={error} type="error" />}
        <div className="flex justify-end gap-2 mt-4 col-span-4">
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
