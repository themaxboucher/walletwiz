import { Input } from "../input";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";

interface TextFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  description?: React.ReactNode;
  variant?: "destructive" | "default";
}

export function TextField({
  form,
  name,
  label,
  placeholder,
  className,
  description,
  variant = "default",
}: TextFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      <Input
        placeholder={placeholder}
        {...form.register(name)}
        className={className}
        aria-invalid={
          form.formState.errors[name] || variant === "destructive"
            ? "true"
            : "false"
        }
      />
    </FormFieldWrapper>
  );
}
