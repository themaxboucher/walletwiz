import { Textarea } from "../textarea";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";

interface TextareaFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export function TextareaField({
  form,
  name,
  label,
  placeholder,
  className,
  rows = 3,
}: TextareaFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      className={className}
    >
      <Textarea
        placeholder={placeholder}
        rows={rows}
        {...form.register(name)}
      />
    </FormFieldWrapper>
  );
}
