import { Input } from "../input";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface NumberFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  step?: string;
  min?: number;
  max?: number;
  isCurrency?: boolean;
}

export function NumberField({
  form,
  name,
  label,
  placeholder,
  className,
  step = "0.01",
  min,
  max,
  isCurrency = false,
}: NumberFieldProps) {
  const [displayValue, setDisplayValue] = useState<string>("");

  // Initialize display value from form value
  useEffect(() => {
    const value = form.getValues(name);
    if (value !== undefined && value !== null) {
      setDisplayValue(isCurrency ? formatCurrency(value) : value.toString());
    }
  }, [form, name, isCurrency]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const parseCurrency = (value: string): number => {
    // Remove commas and spaces
    const numericValue = value.replace(/[,]/g, "");
    return parseFloat(numericValue) || 0;
  };

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      className={className}
    >
      {({ field }) => (
        <div className="relative">
          {isCurrency && (
            <DollarSign className="absolute top-1/2 h-4 w-4 -translate-y-1/2 left-2 text-muted-foreground pointer-events-none" />
          )}
          <Input
            type="text"
            inputMode="decimal"
            placeholder={placeholder}
            value={displayValue}
            className={cn(
              isCurrency && "text-right pl-8",
              !isCurrency && "text-left"
            )}
            onChange={(e) => {
              const value = e.target.value;
              setDisplayValue(value);

              // Only update form value if it's a valid number
              if (
                value === "" ||
                /^-?\d*\.?\d*$/.test(value.replace(/[,]/g, ""))
              ) {
                const numericValue = parseCurrency(value);
                field.onChange(numericValue);
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value) {
                const numericValue = parseCurrency(value);
                setDisplayValue(
                  isCurrency
                    ? formatCurrency(numericValue)
                    : numericValue.toString()
                );
                field.onChange(numericValue);
              }
            }}
            onFocus={(e) => {
              // When focusing, show the raw number without formatting
              const value = field.value;
              if (value !== undefined && value !== null) {
                setDisplayValue(value.toString());
              }
            }}
          />
        </div>
      )}
    </FormFieldWrapper>
  );
}
