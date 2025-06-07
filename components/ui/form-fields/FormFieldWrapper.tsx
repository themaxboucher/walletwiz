import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { ReactNode } from "react";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";

interface FormFieldWrapperProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  children:
    | ReactNode
    | ((props: { field: ControllerRenderProps<any, string> }) => ReactNode);
  className?: string;
}

export function FormFieldWrapper({
  form,
  name,
  label,
  children,
  className,
}: FormFieldWrapperProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {typeof children === "function" ? children({ field }) : children}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
