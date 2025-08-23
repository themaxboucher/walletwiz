"use client";

import { Button } from "../ui/button";
import { NumberField } from "../ui/form-fields/NumberField";
import { DateField } from "../ui/form-fields/DateField";
import { TextareaField } from "../ui/form-fields/TextareaField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { categoryIcons, categoryColors } from "@/constants";
import {
  createTransaction,
  updateTransaction,
} from "@/lib/actions/transaction.actions";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import FormAlert from "../FormAlert";
import { useRouter } from "next/navigation";
import { SelectField } from "../ui/form-fields/SelectField";
import { PayeeField } from "../ui/form-fields/PayeeField";
import { AccountField } from "../ui/form-fields/AccountField";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  getPayeeByAccount,
  createPayee,
  updatePayee,
} from "@/lib/actions/payee.actions";
import DeleteTransactionDialog from "./DeleteTransactionDialog";

// Define the Zod schema for the transaction form
const transactionFormSchema = z.object({
  payee: z.object({
    value: z.string(), // brandId
    label: z.string(), // name
    domain: z.string().optional().nullable(),
    id: z.string().optional(), // Appwrite payee document ID for previous payees
    defaultCategoryId: z.string().optional().nullable(),
    isAccount: z.boolean().optional(),
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
  const [createOpposing, setCreateOpposing] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

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
          message: `${category.name} amount must not be zero`,
          path: ["amount"],
        });
      }

      // Prevent selecting the same account for payee (source) and selected account (destination)
      if (
        data.payee?.isAccount &&
        data.payee?.value &&
        data.account &&
        data.account === data.payee.value
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Destination account must be different from source account`,
          path: ["account"],
        });
      }
    }
  );

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(refinedTransactionFormSchema),
    defaultValues: transactionToEdit
      ? {
          payee: transactionToEdit.payee
            ? (() => {
                const isAccountPayee = Boolean(transactionToEdit.payee.account);
                // Resolve full Account from props to get institution details (Appwrite limits nested depth)
                const accountFromProps = isAccountPayee
                  ? accounts.find(
                      (a) => a.$id === transactionToEdit.payee.account?.$id
                    )
                  : undefined;
                return {
                  value: isAccountPayee
                    ? accountFromProps?.$id ||
                      transactionToEdit.payee.account?.$id ||
                      ""
                    : transactionToEdit.payee.brandId || "",
                  label: isAccountPayee
                    ? accountFromProps?.name ||
                      transactionToEdit.payee.account?.name ||
                      transactionToEdit.payee.name
                    : transactionToEdit.payee.name,
                  domain: isAccountPayee
                    ? accountFromProps?.type?.brandDomain ||
                      accountFromProps?.institution?.domain ||
                      undefined
                    : transactionToEdit.payee.domain || undefined,
                  id: transactionToEdit.payee.$id,
                  defaultCategoryId:
                    transactionToEdit.payee.defaultCategory?.$id || undefined,
                  isAccount: isAccountPayee || undefined,
                };
              })()
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
  // - Expense: ensure negative
  // - Income or Transfer: ensure positive
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
      // Convert to positive for income and transfer
      form.setValue("amount", Math.abs(Number(watchedAmount)), {
        shouldValidate: true,
      });
    }
  }, [watchedCategory, watchedAmount, categories, form]);

  // When a payee is selected, auto-set the category
  useEffect(() => {
    if (!watchedPayee) return;
    // If the payee is an account-based payee, force the Transfer category
    if (watchedPayee.isAccount) {
      const transferCategory = categories.find(
        (cat) => cat.type === "transfer"
      );
      if (!transferCategory) return;
      const transferName = transferCategory.name;
      if (form.getValues("category") !== transferName) {
        form.setValue("category", transferName, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      return;
    }
    // Otherwise, if the payee has a defaultCategoryId, use it
    if (watchedPayee.defaultCategoryId) {
      const defaultCategory = categories.find(
        (cat) => cat.$id === watchedPayee.defaultCategoryId
      );
      if (!defaultCategory) return;
      const defaultCategoryName = defaultCategory.name;
      if (form.getValues("category") !== defaultCategoryName) {
        form.setValue("category", defaultCategoryName, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [watchedPayee, categories, form]);

  // Get the users ID from the first category
  const userId = categories[0]?.user?.$id;
  if (!userId) throw new Error("User not found");

  // Helpers to avoid duplicated defaultCategory update logic
  async function setPayeeDefaultCategory(
    payeeId: string | undefined,
    categoryId: string
  ) {
    if (!payeeId) return;
    try {
      await updatePayee(payeeId, { defaultCategory: categoryId });
    } catch (e) {
      console.error("Failed to update payee default category", e);
    }
  }

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
          lastUsed: new Date().toISOString(),
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
        // Update the transaction
        await updateTransaction(String(transactionToEdit.$id), transactionData);
      } else {
        // Create the primary transaction first
        await createTransaction(transactionData);

        // If enabled and this is a transfer between accounts, create the opposing transaction
        if (createOpposing && values.payee?.isAccount) {
          const sourceAccountId = String(values.payee.value); // From account
          const destinationAccountId = String(values.account); // To account

          // Find or create a payee for the destination account
          let opposingPayeeId: string | null = null;
          try {
            const existingPayee = await getPayeeByAccount(destinationAccountId);
            if (existingPayee?.$id) {
              opposingPayeeId = existingPayee.$id as string;
            } else {
              const destinationAccount = accounts.find(
                (a) => a.$id === destinationAccountId
              );
              const newPayee = await createPayee(
                {
                  name: destinationAccount?.name || "Account",
                  account: destinationAccountId,
                } as PayeeDB,
                userId!
              );
              opposingPayeeId = newPayee?.$id as string;
            }
          } catch (e) {
            console.error(
              "Failed to get/create payee for opposing transaction",
              e
            );
          }

          const opposingTransactionData = {
            payee: opposingPayeeId || {
              name: "Account",
              account: destinationAccountId,
              user: userId!,
            },
            amount: -Number(values.amount.toFixed(2)),
            category: selectedCategory.$id,
            date: values.date.toISOString(),
            note: "Automatically created transfer transaction",
            user: userId,
            account: sourceAccountId,
          } as TransactionDB;

          await createTransaction(opposingTransactionData);

          // Ensure opposing account payee default category reflects transfer
          await setPayeeDefaultCategory(
            opposingPayeeId || undefined,
            selectedCategory.$id
          );
        }
      }

      await setPayeeDefaultCategory(values.payee?.id, selectedCategory.$id);

      router.refresh();
      onCancel();
    } catch (error) {
      setError(
        "An error occurred while saving the transaction. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  const isNonAccountPayeeSelected = Boolean(
    watchedPayee && !watchedPayee.isAccount
  );
  const visibleCategories = isNonAccountPayeeSelected
    ? categories.filter((cat) => cat.type !== "transfer")
    : categories;

  const categoryOptions = visibleCategories
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

  // If a non-account payee is selected and current category is Transfer, clear it
  useEffect(() => {
    if (!watchedPayee || watchedPayee.isAccount) return;
    const currentCategoryName = form.getValues("category");
    if (!currentCategoryName) return;
    const currentCategory = categories.find(
      (c) => c.name === currentCategoryName
    );
    if (currentCategory?.type === "transfer") {
      form.setValue("category", "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      form.clearErrors("category");
    }
  }, [watchedPayee, categories, form]);

  // Exclude the payee account from the destination account options for transfers
  const selectableAccounts = watchedPayee?.isAccount
    ? accounts.filter((account) => account.$id !== watchedPayee.value)
    : accounts;

  // If transfer payee is selected and selected account matches payee account, clear the account field
  useEffect(() => {
    if (!watchedPayee?.isAccount) return;
    const selectedAccount = form.getValues("account");
    if (selectedAccount && selectedAccount === watchedPayee.value) {
      form.setValue("account", "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      form.clearErrors("account");
    }
  }, [watchedPayee, form]);

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
            label="Payee"
            placeholder="Select payee"
          />
          <SelectField
            form={form}
            name="category"
            label="Category"
            options={categoryOptions}
            placeholder="Select category"
            disabled={Boolean(watchedPayee?.isAccount)}
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
          <AccountField
            form={form}
            name="account"
            label="Account"
            accounts={selectableAccounts}
            placeholder="Select account"
          />
        </div>
        {watchedPayee?.isAccount && !transactionToEdit && (
          <Label className="shadow-xs dark:bg-input/30 hover:bg-accent dark:hover:bg-input/50 flex items-start gap-3 rounded-lg border border-input p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/10 dark:has-[[aria-checked=true]]:border-primary dark:has-[[aria-checked=true]]:bg-primary/10 transition-all duration-200 ease-in-out">
            <Checkbox
              checked={createOpposing}
              onCheckedChange={(checked) => setCreateOpposing(Boolean(checked))}
              className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
            />
            <div className="grid gap-1.5 font-normal">
              <p className="text-sm leading-none font-medium">
                Match transaction
              </p>
              <p className="text-muted-foreground text-xs">
                Automatically add the corresponding transaction for{" "}
                <span className="font-medium">{watchedPayee?.label}</span>
              </p>
            </div>
          </Label>
        )}
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
        <div className="flex justify-between mt-4">
          {transactionToEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
              Delete Transaction
            </Button>
          )}
          <div className={`flex gap-2 ${!transactionToEdit ? "ml-auto" : ""}`}>
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

      {transactionToEdit && (
        <DeleteTransactionDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          transactionId={transactionToEdit.$id!}
          onTransactionDeleted={onCancel}
        />
      )}
    </Form>
  );
}
