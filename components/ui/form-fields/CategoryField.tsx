import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "../select";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/constants";

interface SelectOption {
  name: string;
  icon?: LucideIcon;
  color?: CategoryColor;
  type?: "income" | "expense";
}

interface SelectFieldProps {
  form: UseFormReturn<any>;
  options: SelectOption[];
  className?: string;
}

export function CategoryField({ form, options, className }: SelectFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name="category"
      label="Category"
      className={className}
    >
      {({ field }: { field: ControllerRenderProps<any, string> }) => {
        const selectedOption = options.find(
          (option) => option.name === field.value
        );

        const incomeOptions = options.filter((opt) => opt.type === "income");
        const expenseOptions = options.filter((opt) => opt.type === "expense");

        return (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category">
                {selectedOption && (
                  <div className="flex items-center gap-2">
                    {selectedOption.icon && selectedOption.color && (
                      <selectedOption.icon
                        className={cn(
                          "h-4 w-4",
                          categoryColors[selectedOption.color]
                        )}
                      />
                    )}
                    <span>{selectedOption.name}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {incomeOptions.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Income</SelectLabel>
                  {incomeOptions.map((option) => (
                    <SelectItem
                      key={option.name}
                      value={option.name}
                      className="flex items-center gap-2"
                    >
                      {option.icon && option.color && (
                        <option.icon
                          className={cn(
                            "h-4 w-4",
                            categoryColors[option.color]
                          )}
                        />
                      )}
                      <span>{option.name}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              {expenseOptions.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Expense</SelectLabel>
                  {expenseOptions.map((option) => (
                    <SelectItem
                      key={option.name}
                      value={option.name}
                      className="flex items-center gap-2"
                    >
                      {option.icon && option.color && (
                        <option.icon
                          className={cn(
                            "h-4 w-4",
                            categoryColors[option.color]
                          )}
                        />
                      )}
                      <span>{option.name}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        );
      }}
    </FormFieldWrapper>
  );
}
