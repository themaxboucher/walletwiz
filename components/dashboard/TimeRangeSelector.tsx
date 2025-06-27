"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const RANGE_OPTIONS = [
  { label: "1W", value: "1W" },
  { label: "1M", value: "1M" },
  { label: "3M", value: "3M" },
  { label: "6M", value: "6M" },
  { label: "YTD", value: "YTD" },
  { label: "1Y", value: "1Y" },
  { label: "ALL", value: "ALL" },
];

interface TimeRangeSelectorProps {
  lastDate: Date;
  onDateChange: (date: Date) => void;
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export default function TimeRangeSelector({
  lastDate,
  onDateChange,
  selectedRange,
  onRangeChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 p-1 rounded-md flex gap-1 bg-card border shadow-xs">
        {RANGE_OPTIONS.map((option, idx) => (
          <button
            key={option.value}
            className={`px-3 h-full text-xs rounded-sm font-semibold transition-colors
              ${
                selectedRange === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent dark:hover:bg-input/50"
              }
            `}
            onClick={() => onRangeChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-fit justify-start text-left font-normal bg-card dark:bg-card active:scale-100"
          >
            <CalendarIcon className=" h-4 w-4" />
            {lastDate ? format(lastDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={lastDate}
            onSelect={(date) => date && onDateChange(date)}
            fromYear={2000}
            toYear={new Date().getFullYear()}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
