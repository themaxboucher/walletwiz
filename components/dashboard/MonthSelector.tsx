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
  // Get unique years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    transactions.forEach((tx) => {
      const year = new Date(tx.date).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a)); // Sort descending
  }, [transactions]);

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[80px]">
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
        <SelectTrigger className="w-[90px]">
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
