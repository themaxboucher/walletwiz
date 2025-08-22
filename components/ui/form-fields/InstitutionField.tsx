import { useState, useRef, useEffect } from "react";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { ChevronsUpDownIcon, Plus, Building } from "lucide-react";
import { cn, createBrandfetchIconUrl } from "@/lib/utils";
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
import { getFinancialInstitutions } from "@/lib/actions/financialInstitutions.actions";

export interface InstitutionOption {
  value: string; // $id for existing, name for new
  label: string; // name
  domain: string;
  id?: string; // Appwrite institution document ID for existing institutions
}

interface InstitutionFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function InstitutionField({
  form,
  name,
  label = "Institution",
  placeholder = "Select institution",
  className,
}: InstitutionFieldProps) {
  const [allInstitutions, setAllInstitutions] = useState<InstitutionOption[]>(
    []
  );
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    InstitutionOption[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Priority institutions to display when no search input
  const priorityInstitutionNames = [
    "Chase",
    "Bank of America",
    "Citi",
    "Wells Fargo",
    "RBC",
    "TD",
    "Scotiabank",
  ];

  // Filter priority institutions from all available institutions
  const getPriorityInstitutions = (
    institutions: InstitutionOption[]
  ): InstitutionOption[] => {
    return priorityInstitutionNames
      .map((priorityName) =>
        institutions.find(
          (inst) =>
            inst.label.toLowerCase().includes(priorityName.toLowerCase()) ||
            priorityName.toLowerCase().includes(inst.label.toLowerCase())
        )
      )
      .filter((inst): inst is InstitutionOption => inst !== undefined);
  };

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        const institutions = await getFinancialInstitutions();
        if (institutions && institutions.length > 0) {
          const options: InstitutionOption[] = institutions.map(
            (institution: FinancialInstitution) => ({
              value: institution.$id!,
              label: institution.name,
              domain: institution.domain,
              id: institution.$id!,
            })
          );
          setAllInstitutions(options);
          // Initially show only priority institutions
          setFilteredInstitutions(getPriorityInstitutions(options));
        } else {
          setAllInstitutions([]);
          setFilteredInstitutions([]);
        }
      } catch (error) {
        setAllInstitutions([]);
        setFilteredInstitutions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const handleSearchInput = (input: string) => {
    setSearchInput(input);
    // Clear any existing timeout
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    // Filter options based on search input
    searchTimeout.current = setTimeout(() => {
      if (!input || input.length < 1) {
        // Show priority institutions when search is empty
        setFilteredInstitutions(getPriorityInstitutions(allInstitutions));
        return;
      }

      const filtered = allInstitutions.filter((option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredInstitutions(filtered);
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
                title={selectedOption?.label}
              >
                <span className="flex items-center gap-2">
                  {selectedOption &&
                    (selectedOption.domain ? (
                      <Image
                        width={18}
                        height={18}
                        src={createBrandfetchIconUrl(selectedOption.domain, 18)}
                        alt={`${selectedOption.label} logo`}
                        className="size-4.5 rounded-[0.188rem] object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="size-4.5 rounded-[0.188rem] bg-muted flex items-center justify-center">
                        <Building className="size-3 text-muted-foreground" />
                      </div>
                    ))}
                  <span>{selectedOption?.label || placeholder}</span>
                </span>
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  onValueChange={handleSearchInput}
                  placeholder="Search institutions..."
                  showSearchIcon={false}
                />
                {loading && (
                  <div className="p-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2 py-1.5"
                      >
                        <Skeleton className="size-4.5 rounded-[0.188rem]" />
                        <Skeleton className="h-3 flex-1" />
                      </div>
                    ))}
                  </div>
                )}
                {!loading && (
                  <CommandList>
                    {filteredInstitutions.length === 0 && !searchInput && (
                      <CommandEmpty>No institutions found.</CommandEmpty>
                    )}
                    {filteredInstitutions.length === 0 && searchInput && (
                      <CommandEmpty>No institution found.</CommandEmpty>
                    )}
                    {filteredInstitutions.length > 0 && (
                      <CommandGroup>
                        {filteredInstitutions.slice(0, 7).map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              const selected = filteredInstitutions.find(
                                (opt) => opt.value === currentValue
                              );
                              if (selected) {
                                field.onChange(selected);
                              } else {
                                field.onChange(null);
                              }
                              setOpen(false);
                            }}
                            title={option.label}
                          >
                            {option.domain ? (
                              <Image
                                width={18}
                                height={18}
                                src={createBrandfetchIconUrl(option.domain, 18)}
                                alt={`${option.label} logo`}
                                className="size-4.5 rounded-[0.188rem] object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="size-4.5 rounded-[0.188rem] bg-muted flex items-center justify-center">
                                <Building className="size-3 text-muted-foreground" />
                              </div>
                            )}
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
                            const newInstitution = {
                              value: searchInput.trim(),
                              label: searchInput.trim(),
                              domain: "",
                            };
                            field.onChange(newInstitution);
                            setOpen(false);
                          }}
                        >
                          <span className="size-4.5 rounded-[0.188rem] flex items-center justify-center">
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
