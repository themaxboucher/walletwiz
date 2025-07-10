import { Button } from "../button";
import { Calendar } from "../calendar";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  className?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DateField({
  form,
  name,
  label,
  className,
  placeholder = "Pick a date",
  minDate,
  maxDate,
}: DateFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      className={className}
    >
      {({ field }: { field: ControllerRenderProps<any, string> }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal active:scale-100",
                !field.value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(field.value, "PPP")
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              captionLayout="dropdown"
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </FormFieldWrapper>
  );
}
