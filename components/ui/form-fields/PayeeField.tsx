import { useState, useRef, useEffect } from "react";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import {
  ChevronsUpDownIcon,
  Plus,
  Store,
  ArrowLeftRight,
  Landmark,
  RefreshCcw,
} from "lucide-react";
import { cn, createBrandfetchIconUrl, getLucideIconByName } from "@/lib/utils";
import { accountTypeIcons } from "@/constants";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import Image from "next/image";
import { Skeleton } from "../skeleton";
import { getPayees } from "@/lib/actions/payee.actions";

export interface ComboboxOption {
  value: string;
  label: string;
  domain?: string;
  id?: string; // Appwrite payee document ID for previous payees
  isAccount?: boolean; // Flag to indicate if this is an account-based payee
  defaultCategoryId?: string; // Only for previous payees
  accountTypeIconName?: string; // For account payees without domain
}

interface BrandfetchBrand {
  brandId: string;
  claimed: boolean;
  domain: string;
  icon: string;
  name: string;
  qualityScore: number;
  verfied?: boolean;
  _score: null | number;
}

interface PayeeFieldProps {
  form: UseFormReturn<any>;
  name: string;
  userId: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function PayeeField({
  form,
  name,
  userId,
  label = "Payee",
  placeholder = "Select payee",
  className,
}: PayeeFieldProps) {
  const [payeeOptions, setPayeeOptions] = useState<ComboboxOption[]>([]);
  const [previousPayeeOptions, setPreviousPayeeOptions] = useState<
    ComboboxOption[]
  >([]);
  const [payeeLoading, setPayeeLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const payeeSearchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Replace with frequiently used payees
  const staticPayeeOptions: ComboboxOption[] = [
    {
      value: "Amazon",
      label: "Amazon",
      domain: "amazon.com",
    },
    {
      value: "Walmart",
      label: "Walmart",
      domain: "walmart.com",
    },
    {
      value: "Costco",
      label: "Costco",
      domain: "costco.com",
    },
    {
      value: "Shell",
      label: "Shell",
      domain: "shell.com",
    },
    {
      value: "Starbucks",
      label: "Starbucks",
      domain: "starbucks.com",
    },
  ];

  useEffect(() => {
    const fetchPreviousPayees = async () => {
      setPayeeLoading(true);
      try {
        const previousPayees = await getPayees(userId);
        const options: ComboboxOption[] = (previousPayees || []).map(
          (payee: Payee) => {
            if (payee.account) {
              return {
                value: payee.account.$id,
                label: payee.account.name,
                domain:
                  payee.account.type?.brandDomain ||
                  payee.account.institution?.domain,
                id: payee.$id,
                isAccount: true,
                defaultCategoryId: payee.defaultCategory?.$id,
                accountTypeIconName: payee.account.type?.iconName,
              };
            } else {
              return {
                value: payee.brandId || payee.name,
                label: payee.name,
                domain: payee.domain,
                id: payee.$id,
                isAccount: false,
                defaultCategoryId: payee.defaultCategory?.$id,
              };
            }
          }
        );
        setPreviousPayeeOptions(options);

        // If we have fewer than 5 previous payees, append static options
        if (options.length < 5) {
          const combinedOptions = [...options, ...staticPayeeOptions];
          setPayeeOptions(combinedOptions);
        } else {
          setPayeeOptions(options);
        }
      } catch (error) {
        // On error, fall back to static options only
        setPreviousPayeeOptions([]);
        setPayeeOptions(staticPayeeOptions);
      } finally {
        setPayeeLoading(false);
      }
    };

    fetchPreviousPayees();
  }, []);

  const fetchPayeeOptions = async (query: string) => {
    // If the query is empty, reset to previously selected payees
    if (!query || query.length < 1) {
      // If we have fewer than 5 previous payees, include static options
      if (previousPayeeOptions.length < 5) {
        const combinedOptions = [
          ...previousPayeeOptions,
          ...staticPayeeOptions,
        ];
        setPayeeOptions(combinedOptions);
      } else {
        setPayeeOptions(previousPayeeOptions);
      }
      setPayeeLoading(false);
      return;
    }

    setPayeeLoading(true);
    try {
      const clientId = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID;
      const res = await fetch(
        `https://api.brandfetch.io/v2/search/${encodeURIComponent(
          query
        )}?c=${clientId}`
      );
      let brandfetchOptions: ComboboxOption[] = [];
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Filter: qualityScore >= 0.5, latin brand names only, deduplicate by name keeping highest qualityScore
          const filtered = data
            .filter(
              (brand: BrandfetchBrand) =>
                brand.qualityScore >= 0.5 &&
                /^[A-Za-z\d\s\p{P}\p{S}]+$/u.test(brand.name)
            )
            .reduce(
              (
                acc: Record<string, BrandfetchBrand>,
                brand: BrandfetchBrand
              ) => {
                if (
                  !acc[brand.name] ||
                  brand.qualityScore > acc[brand.name].qualityScore
                ) {
                  acc[brand.name] = brand;
                }
                return acc;
              },
              {}
            );
          brandfetchOptions = (
            Object.values(filtered) as BrandfetchBrand[]
          ).map((brand) => ({
            value: brand.brandId,
            label: brand.name,
            domain: brand.domain,
          }));
        }
      }
      // Filter previous payees by query (case-insensitive substring match on label)
      const filteredPrevious = previousPayeeOptions.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );
      // Merge previous payees and brandfetch results, avoiding duplicates by label (case-insensitive)
      const mergedOptions: ComboboxOption[] = [
        ...filteredPrevious,
        ...brandfetchOptions.filter(
          (brandOpt) =>
            !filteredPrevious.some(
              (prevOpt) => prevOpt.value === brandOpt.value
            )
        ),
      ];
      setPayeeOptions(mergedOptions);
    } catch (e) {
      // On error, fallback to filtered previous payees
      setPayeeOptions(
        previousPayeeOptions.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        )
      );
    } finally {
      setPayeeLoading(false);
    }
  };

  // Debounced input handler for payee search
  const handlePayeeInput = (input: string) => {
    setSearchInput(input);
    // Clear any existing debounce timeout
    if (payeeSearchTimeout.current) clearTimeout(payeeSearchTimeout.current);
    // Set a new timeout to fetch options after 200ms
    payeeSearchTimeout.current = setTimeout(() => {
      fetchPayeeOptions(input);
    }, 200);
  };

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      className={className}
    >
      {({ field }: { field: ControllerRenderProps<any, any> }) => {
        // Get selected option from form field value (which contains the full option object)
        const selectedOption = field.value;
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between active:scale-100 font-normal",
                  !selectedOption &&
                    "text-muted-foreground hover:text-muted-foreground"
                )}
                title={selectedOption?.label}
              >
                <span className="flex items-center gap-2">
                  {selectedOption &&
                    (selectedOption.domain ? (
                      <Image
                        width={20}
                        height={20}
                        src={createBrandfetchIconUrl(selectedOption.domain, 20)}
                        alt={`${selectedOption.label} logo`}
                        className={cn(
                          "size-5 object-cover",
                          selectedOption.isAccount
                            ? "rounded-[0.188rem]"
                            : "rounded-full"
                        )}
                        unoptimized // Necessary for brandfetch.io hotlinking guidelines
                      />
                    ) : selectedOption.isAccount &&
                      selectedOption.accountTypeIconName &&
                      accountTypeIcons[selectedOption.accountTypeIconName] ? (
                      <div className="size-5 rounded-[0.188rem] bg-muted flex items-center justify-center">
                        {(() => {
                          const Icon = getLucideIconByName(
                            accountTypeIcons,
                            selectedOption.accountTypeIconName
                          );
                          return Icon ? (
                            <Icon className="size-3 text-muted-foreground" />
                          ) : null;
                        })()}
                      </div>
                    ) : selectedOption.isAccount ? (
                      <div className="size-5 rounded-[0.188rem] bg-muted flex items-center justify-center">
                        <Landmark className="size-3 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                        <Store className="size-3 text-muted-foreground" />
                      </div>
                    ))}
                  <span className="truncate max-w-[120px]">
                    {selectedOption?.label || placeholder}
                  </span>
                </span>
                <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  onValueChange={handlePayeeInput}
                  placeholder="Search..."
                  showSearchIcon={false}
                />
                {payeeLoading && (
                  <div className="p-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2 py-1.5"
                      >
                        <Skeleton className="size-5 rounded-full" />
                        <Skeleton className="h-3 flex-1" />
                      </div>
                    ))}
                  </div>
                )}
                {!payeeLoading && (
                  <CommandList>
                    {payeeOptions.length === 0 && (
                      <CommandEmpty>No payee found.</CommandEmpty>
                    )}
                    {payeeOptions.length > 0 && (
                      <CommandGroup>
                        {payeeOptions.slice(0, 7).map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              const selected = payeeOptions.find(
                                (opt) => opt.value === currentValue
                              );
                              if (selected) {
                                field.onChange(selected);
                              } else field.onChange(null);
                              setOpen(false);
                            }}
                            className="group"
                            title={option.label}
                          >
                            <span className="relative">
                              {option.domain ? (
                                <Image
                                  width={20}
                                  height={20}
                                  src={createBrandfetchIconUrl(
                                    option.domain,
                                    20
                                  )}
                                  alt={`${option.label} logo`}
                                  className={cn(
                                    "size-5 min-w-5 object-cover",
                                    option.isAccount
                                      ? "rounded-[0.188rem]"
                                      : "rounded-full"
                                  )}
                                  unoptimized // Necessary for brandfetch.io hotlinking guidelines
                                />
                              ) : option.isAccount &&
                                option.accountTypeIconName &&
                                accountTypeIcons[option.accountTypeIconName] ? (
                                <div className="size-5 rounded-[0.188rem] bg-muted flex items-center justify-center">
                                  {(() => {
                                    const Icon = getLucideIconByName(
                                      accountTypeIcons,
                                      option.accountTypeIconName
                                    );
                                    return Icon ? (
                                      <Icon className="size-3 text-muted-foreground" />
                                    ) : null;
                                  })()}
                                </div>
                              ) : option.isAccount ? (
                                <div className="size-5 rounded-[0.188rem] bg-muted flex items-center justify-center">
                                  <Landmark className="size-3 text-muted-foreground" />
                                </div>
                              ) : (
                                <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                                  <Store className="size-3 text-muted-foreground" />
                                </div>
                              )}
                              {option?.id && !option.isAccount && (
                                <span className="absolute -bottom-[0.2rem] -right-[0.2rem] size-3 bg-primary shadow-xs rounded-full flex items-center justify-center">
                                  <RefreshCcw className="text-white size-2" />
                                </span>
                              )}
                              {option?.id && option.isAccount && (
                                <span className="absolute -bottom-[0.2rem] -right-[0.2rem] size-3 bg-blue-500 shadow-xs rounded-xs flex items-center justify-center">
                                  <ArrowLeftRight className="text-white size-2" />
                                </span>
                              )}
                            </span>
                            <span className="truncate">{option.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {searchInput && searchInput.trim().length > 0 && (
                      <CommandGroup>
                        <CommandItem
                          value={`create-${searchInput}`}
                          onSelect={() => {
                            const newPayee = {
                              value: searchInput.trim(),
                              label: searchInput.trim(),
                              domain: undefined,
                              id: undefined,
                            };
                            field.onChange(newPayee);
                            setOpen(false);
                          }}
                        >
                          <span className="size-5 rounded-full flex items-center justify-center">
                            <Plus className="size-4 text-muted-foreground" />
                          </span>
                          <span className="truncate">
                            <span>Create </span>
                            <span className="font-medium">
                              "{searchInput.trim()}"
                            </span>
                          </span>
                        </CommandItem>
                      </CommandGroup>
                    )}
                  </CommandList>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    </FormFieldWrapper>
  );
}
