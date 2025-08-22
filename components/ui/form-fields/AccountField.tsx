import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import Image from "next/image";
import { cn, createBrandfetchIconUrl, getLucideIconByName } from "@/lib/utils";
import { accountTypeIcons } from "@/constants";
import { Landmark } from "lucide-react";

interface AccountFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  accounts: Account[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showMask?: boolean;
}

export function AccountField({
  form,
  name,
  label = "Account",
  accounts,
  placeholder = "Select account",
  className,
  disabled = false,
  showMask = true,
}: AccountFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      className={className}
    >
      {({ field }: { field: ControllerRenderProps<any, string> }) => {
        const selectedAccount = accounts.find((a) => a.$id === field.value);

        const renderAccountIcon = (account?: Account, size: number = 20) => {
          if (!account) return null;
          const brandDomain =
            account.type?.brandDomain || account.institution?.domain;
          if (brandDomain) {
            return (
              <Image
                width={size}
                height={size}
                src={createBrandfetchIconUrl(brandDomain, size)}
                alt={`${account.name} logo`}
                className={cn(
                  size <= 18 ? "size-4.5" : "size-5",
                  "rounded-[0.188rem] object-cover"
                )}
                unoptimized
              />
            );
          }
          const TypeIcon = getLucideIconByName(
            accountTypeIcons,
            account.type?.iconName
          );
          return (
            <div className="size-5 rounded-[0.188rem] bg-muted flex items-center justify-center">
              {TypeIcon ? (
                <TypeIcon className="size-3 text-muted-foreground" />
              ) : (
                <Landmark className="size-3 text-muted-foreground" />
              )}
            </div>
          );
        };

        const renderAccountLabel = (account: Account) => {
          if (!showMask) return account.name;
          if (account.mask) {
            return (
              <>
                <span className="tracking-tighter">••••</span> {account.mask}
              </>
            );
          }
          return account.name;
        };

        return (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              className="w-full disabled:opacity-100"
              disabled={disabled}
            >
              <SelectValue
                placeholder={placeholder}
                title={selectedAccount?.name}
              >
                {selectedAccount && (
                  <div className="flex items-center gap-2">
                    {renderAccountIcon(selectedAccount, 20)}
                    <span className="truncate max-w-[120px]">
                      {renderAccountLabel(selectedAccount)}
                    </span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[192px]">
              {accounts.map((account) => (
                <SelectItem
                  key={account.$id}
                  value={account.$id!}
                  className="flex items-center gap-2"
                  title={account.name}
                >
                  {renderAccountIcon(account, 18)}
                  <span className="truncate">{account.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </FormFieldWrapper>
  );
}
