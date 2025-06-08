"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DateRange } from "react-day-picker";

interface TimeRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  transactions: Array<{ date: string }>;
}

const PRESET_RANGES = [
  {
    label: "Last Week",
    getRange: (transactions: Array<{ date: string }>) => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return { start, end };
    },
  },
  {
    label: "Last Month",
    getRange: (transactions: Array<{ date: string }>) => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return { start, end };
    },
  },
  {
    label: "Last 3 Months",
    getRange: (transactions: Array<{ date: string }>) => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return { start, end };
    },
  },
  {
    label: "Last 6 Months",
    getRange: (transactions: Array<{ date: string }>) => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      return { start, end };
    },
  },
  {
    label: "Last Year",
    getRange: (transactions: Array<{ date: string }>) => {
      const end = new Date();
      const start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      return { start, end };
    },
  },
  {
    label: "All Time",
    getRange: (transactions: Array<{ date: string }>) => {
      const dates = transactions.map((tx) => new Date(tx.date));
      const start = new Date(Math.min(...dates.map((d) => d.getTime())));
      const latestTxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      const end = new Date();
      // Use the later date between latest transaction and current date
      return {
        start,
        end: latestTxDate > end ? latestTxDate : end,
      };
    },
  },
];

const CUSTOM_RANGE = "Custom";

export default function TimeRangeSelector({
  dateRange,
  onDateRangeChange,
  transactions,
}: TimeRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("Last Month");

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const checkIfMatchesPreset = (from: Date, to: Date) => {
    for (const preset of PRESET_RANGES) {
      const { start, end } = preset.getRange(transactions);
      if (isSameDay(from, start) && isSameDay(to, end)) {
        return preset.label;
      }
    }
    return CUSTOM_RANGE;
  };

  const handlePresetSelect = (value: string) => {
    if (value === CUSTOM_RANGE) {
      return; // Don't do anything if Custom is selected
    }
    const preset = PRESET_RANGES.find((p) => p.label === value);
    if (preset) {
      const { start, end } = preset.getRange(transactions);
      onDateRangeChange({ from: start, to: end });
      setSelectedPreset(value);
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onDateRangeChange(range);
      const matchingPreset = checkIfMatchesPreset(range.from, range.to);
      setSelectedPreset(matchingPreset);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedPreset} onValueChange={handlePresetSelect}>
        <SelectTrigger className="w-[145px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRESET_RANGES.map((preset) => (
            <SelectItem key={preset.label} value={preset.label}>
              {preset.label}
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_RANGE}>Custom Range</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal bg-white",
              !dateRange && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
