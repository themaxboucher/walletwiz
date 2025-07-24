import { useState, useRef, useEffect } from "react";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { ChevronsUpDownIcon, Repeat, Plus, Store } from "lucide-react";
import { cn } from "@/lib/utils";
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
  icon?: string;
  id?: string; // Appwrite payee document ID for previous payees
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
  const [payeeLoading, setPayeeLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const payeeSearchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Replace with frequiently used payees
  const staticPayeeOptions: ComboboxOption[] = [
    {
      value: "Amazon",
      label: "Amazon",
      icon: "https://cdn.brandfetch.io/idawOgYOsG/w/128/h/128/fallback/lettermark/icon.webp?c=1ax1752763590942bfumLaCV7m4ip2Vpur",
    },
    {
      value: "Walmart",
      label: "Walmart",
      icon: "https://cdn.brandfetch.io/idoGsFQrHx/w/128/h/128/fallback/lettermark/icon.webp?c=1ax1752763656084bfumLaCV7ml-WJiLYd",
    },
    {
      value: "Starbucks",
      label: "Starbucks",
      icon: "https://cdn.brandfetch.io/idwBSkfVb3/w/128/h/128/fallback/lettermark/icon.webp?c=1ax1752763732504bfumLaCV7mV8U1XvbW",
    },
    {
      value: "Apple",
      label: "Apple",
      icon: "https://cdn.brandfetch.io/idnrCPuv87/w/128/h/128/fallback/lettermark/icon.webp?c=1ax1752760398528bfumLaCV7m-J_KKPWt",
    },
  ];

  useEffect(() => {
    const fetchPreviousPayees = async () => {
      try {
        const previousPayees = await getPayees(userId);
        if (previousPayees && previousPayees.length > 0) {
          const options = previousPayees.map((payee: Payee) => ({
            value: payee.brandId,
            label: payee.name,
            icon: payee.logo,
            id: payee.$id,
          }));
          setPreviousPayeeOptions(options);
          setPayeeOptions(options);
        } else {
          // If no previous payees, use static options
          setPreviousPayeeOptions(staticPayeeOptions);
          setPayeeOptions(staticPayeeOptions);
        }
      } catch (error) {
        setPreviousPayeeOptions(staticPayeeOptions);
        setPayeeOptions(staticPayeeOptions);
      }
    };

    fetchPreviousPayees();
  }, []);

  const fetchPayeeOptions = async (query: string) => {
    // If the query is empty, reset to previously selected payees
    if (!query || query.length < 1) {
      setPayeeOptions(previousPayeeOptions);
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
            icon: brand.icon,
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
                  "w-full justify-between active:scale-100 font-normal truncate",
                  !selectedOption &&
                    "text-muted-foreground hover:text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  {selectedOption &&
                    (selectedOption.icon ? (
                      <Image
                        width={24}
                        height={24}
                        src={selectedOption.icon}
                        alt={`${selectedOption.label} logo`}
                        className="size-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                        <Store className="size-3 text-muted-foreground" />
                      </div>
                    ))}
                  <span>{selectedOption?.label || placeholder}</span>
                </span>
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[192px] p-0">
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
                    {payeeOptions.length === 0 && !searchInput && (
                      <CommandEmpty>No option found.</CommandEmpty>
                    )}
                    {payeeOptions.length === 0 && searchInput && (
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
                          >
                            {option.icon ? (
                              <Image
                                width={24}
                                height={24}
                                src={option.icon}
                                alt={`${option.label} logo`}
                                className="size-5 rounded-full object-cover"
                              />
                            ) : (
                              <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                                <Store className="size-3 text-muted-foreground" />
                              </div>
                            )}
                            <span className="truncate">{option.label}</span>
                            {option?.id && (
                              <Repeat className="ml-auto size-4" />
                            )}
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
                              icon: undefined,
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
