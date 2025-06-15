"use client";

import { Button } from "../ui/button";
import { TextField } from "../ui/form-fields/TextField";
import { NumberField } from "../ui/form-fields/NumberField";
import { CategoryField } from "../ui/form-fields/CategoryField";
import { DateField } from "../ui/form-fields/DateField";
import { TextareaField } from "../ui/form-fields/TextareaField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { categoryIcons } from "@/constants";
import {
  createTransaction,
  updateTransaction,
} from "@/lib/actions/transaction.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import FormAlert from "../FormAlert";
import { useRouter } from "next/navigation";

// Define the Zod schema for the transaction form
const transactionFormSchema = z.object({
  merchant: z
    .string()
    .min(1, { message: "Merchant name is required" })
    .max(50, { message: "Merchant name is too long" }),
  amount: z.coerce.number(),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.date({ required_error: "Date is required" }),
  notes: z.string().max(300, { message: "Note is too long" }).optional(),
});

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  transactionToEdit?: Transaction | null;
  onCancel: () => void;
  categories: Category[];
}

export default function TransactionForm({
  transactionToEdit,
  onCancel,
  categories,
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
      }
    }
  );

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(refinedTransactionFormSchema),
    defaultValues: transactionToEdit
      ? {
          merchant: transactionToEdit.merchantName,
          amount: transactionToEdit.amount,
          category: transactionToEdit.category.name,
          date: new Date(transactionToEdit.date),
          notes: transactionToEdit.note,
        }
      : {
          merchant: "",
          amount: undefined,
          category: "",
          date: undefined,
          notes: "",
        },
  });

  async function onSubmit(values: TransactionFormData) {
    setError(null);
    setLoading(true);

    try {
      const selectedCategory = categories.find(
        (cat: Category) => cat.name === values.category
      );
      if (!selectedCategory || !selectedCategory.$id)
        throw new Error("Category not found");

      // Get the users ID from the selected category
      const userId = selectedCategory?.user?.$id;
      if (!userId) throw new Error("User not found");

      const transactionData = {
        merchantName: values.merchant,
        amount: Number(values.amount.toFixed(2)),
        category: selectedCategory.$id,
        date: values.date.toISOString(),
        note: values.notes,
        user: userId,
      };

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
    } finally {
      setLoading(false);
    }
  }

  const categoryOptions = categories.map((cat: Category) => ({
    name: cat.name,
    icon: cat.iconName ? categoryIcons[cat.iconName] : undefined,
    color: cat.color,
    type: cat.type,
  }));

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            form={form}
            name="merchant"
            label="Merchant"
            placeholder="e.g. Amazon"
          />
          <CategoryField form={form} options={categoryOptions} />
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
          <DateField
            form={form}
            name="date"
            label="Date"
            minDate={new Date("1900-01-01")}
          />
        </div>

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
            {!loading &&
              (transactionToEdit ? "Update Transaction" : "Save Transaction")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
