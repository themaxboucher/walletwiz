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
import { categories, categoryIcons } from "@/constants";

// Define the Zod schema for the transaction form
const transactionFormSchema = z
  .object({
    merchant: z.string().min(1, { message: "Merchant name is required" }),
    amount: z.coerce.number(),
    category: z.string().min(1, { message: "Category is required" }),
    date: z.date({ required_error: "Date is required" }),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const category = categories.find((cat) => cat.name === data.category);
    if (!category) return;

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
  });

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  transactionToEdit?: Transaction | null;
  onCancel: () => void;
}

export default function TransactionForm({
  transactionToEdit,
  onCancel,
}: TransactionFormProps) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transactionToEdit
      ? {
          merchant: transactionToEdit.merchant,
          amount: transactionToEdit.amount,
          category: transactionToEdit.category.name,
          date: new Date(transactionToEdit.date),
          notes: transactionToEdit.notes,
        }
      : {
          merchant: "",
          amount: undefined,
          category: "",
          date: undefined,
          notes: "",
        },
  });

  function onSubmit(values: TransactionFormData) {
    console.log(values);
    onCancel();
  }

  const categoryOptions = categories.map((cat) => ({
    value: cat.value || cat.name,
    label: cat.name,
    icon: cat.lucideIconName ? categoryIcons[cat.lucideIconName] : undefined,
    color: cat.color,
    type: cat.type,
  }));

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

        <div className="flex justify-end gap-2 mt-4 col-span-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Transaction</Button>
        </div>
      </form>
    </Form>
  );
}
