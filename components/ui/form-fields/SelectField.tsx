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

interface SelectFieldOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  color?: string;
  group?: string;
}

interface SelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: SelectFieldOption[];
  placeholder?: string;
  className?: string;
}

export function SelectField({
  form,
  name,
  label,
  options,
  placeholder = "Select an option",
  className,
}: SelectFieldProps) {
  // Group options if group is provided
  const groupedOptions = options.reduce<Record<string, SelectFieldOption[]>>(
    (acc, option) => {
      const group = option.group || "";
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    },
    {}
  );

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      className={className}
    >
      {({ field }: { field: ControllerRenderProps<any, string> }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value
        );
        return (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder}>
                {selectedOption && (
                  <div className="flex items-center gap-2">
                    {selectedOption.icon && (
                      <selectedOption.icon
                        className={cn("h-4 w-4", selectedOption.color)}
                      />
                    )}
                    <span>{selectedOption.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedOptions).map(([group, groupOptions]) =>
                group ? (
                  <SelectGroup key={group}>
                    <SelectLabel>{group}</SelectLabel>
                    {groupOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="flex items-center gap-2"
                      >
                        {option.icon && (
                          <option.icon
                            className={cn("h-4 w-4", option.color)}
                          />
                        )}
                        <span>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : (
                  groupOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="flex items-center gap-2"
                    >
                      {option.icon && (
                        <option.icon className={cn("h-4 w-4", option.color)} />
                      )}
                      <span>{option.label}</span>
                    </SelectItem>
                  ))
                )
              )}
            </SelectContent>
          </Select>
        );
      }}
    </FormFieldWrapper>
  );
}
