import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMemo } from "react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface MonthSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  yearValue: string;
  onYearChange: (value: string) => void;
  transactions: Transaction[];
}

export function MonthSelector({
  value,
  onValueChange,
  yearValue,
  onYearChange,
  transactions,
}: MonthSelectorProps) {
  // Get unique years from transactions and include current year
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    const currentYear = new Date().getFullYear().toString();

    // Add current year by default
    years.add(currentYear);

    // Add years from transactions
    transactions.forEach((tx) => {
      const year = new Date(tx.date).getFullYear().toString();
      years.add(year);
    });

    return Array.from(years).sort((a, b) => Number(b) - Number(a)); // Sort descending
  }, [transactions]);

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={yearValue} onValueChange={onYearChange}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
