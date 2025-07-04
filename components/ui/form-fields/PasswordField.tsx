import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../input";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";

interface PasswordFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
}

export function PasswordField({
  form,
  name,
  label,
  placeholder,
  className,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      className={className}
    >
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...form.register(name)}
          aria-invalid={form.formState.errors[name] ? "true" : "false"}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </FormFieldWrapper>
  );
}
