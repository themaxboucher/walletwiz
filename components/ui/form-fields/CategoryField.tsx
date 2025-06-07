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

interface SelectOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  color?: string;
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
          (option) => option.value === field.value
        );

        const incomeOptions = options.filter((opt) => opt.type === "income");
        const expenseOptions = options.filter((opt) => opt.type === "expense");

        return (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category">
                {selectedOption && (
                  <div className="flex items-center gap-2">
                    {selectedOption.icon && (
                      <selectedOption.icon
                        className={cn("h-4 w-4", {
                          "text-primary": selectedOption.color === "green",
                          "text-red-500": selectedOption.color === "red",
                          "text-blue-500": selectedOption.color === "blue",
                          "text-yellow-500": selectedOption.color === "yellow",
                          "text-violet-500": selectedOption.color === "violet",
                          "text-pink-500": selectedOption.color === "pink",
                          "text-orange-500": selectedOption.color === "orange",
                        })}
                      />
                    )}
                    <span>{selectedOption.label}</span>
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
                      key={option.value}
                      value={option.value}
                      className="flex items-center gap-2"
                    >
                      {option.icon && (
                        <option.icon
                          className={cn("h-4 w-4", {
                            "text-primary": option.color === "green",
                            "text-red-500": option.color === "red",
                            "text-blue-500": option.color === "blue",
                            "text-yellow-500": option.color === "yellow",
                            "text-violet-500": option.color === "violet",
                            "text-pink-500": option.color === "pink",
                            "text-orange-500": option.color === "orange",
                          })}
                        />
                      )}
                      <span>{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              {expenseOptions.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Expense</SelectLabel>
                  {expenseOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="flex items-center gap-2"
                    >
                      {option.icon && (
                        <option.icon
                          className={cn("h-4 w-4", {
                            "text-primary": option.color === "green",
                            "text-red-500": option.color === "red",
                            "text-blue-500": option.color === "blue",
                            "text-yellow-500": option.color === "yellow",
                            "text-violet-500": option.color === "violet",
                            "text-pink-500": option.color === "pink",
                            "text-orange-500": option.color === "orange",
                          })}
                        />
                      )}
                      <span>{option.label}</span>
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
