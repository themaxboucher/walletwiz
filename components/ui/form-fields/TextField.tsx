import { Input } from "../input";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";

interface TextFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  description?: React.ReactNode;
}

export function TextField({
  form,
  name,
  label,
  placeholder,
  className,
  description,
}: TextFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      className={className}
      description={description}
    >
      <Input placeholder={placeholder} {...form.register(name)} />
    </FormFieldWrapper>
  );
}
