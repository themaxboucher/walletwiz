"use client";

import * as React from "react";
import { addDays, format, subMonths, subWeeks } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date();

  // 1 week ago from today
  const oneWeekAgo = subWeeks(today, 1);

  // 4 weeks ago from today
  const fourWeeksAgo = subWeeks(today, 4);

  // 3 months ago from today
  const threeMonthsAgo = subMonths(today, 3);

  // 12 months ago from today
  const twelveMonthsAgo = subMonths(today, 12);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: fourWeeksAgo,
    to: today,
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex w-auto flex-col space-y-2 p-2"
          align="start"
        >
          <Select
            onValueChange={(value) => {
              let initialDate;
              if (value === "last-7-days") {
                initialDate = oneWeekAgo;
              } else if (value === "last-4-weeks") {
                initialDate = fourWeeksAgo;
              } else if (value === "last-3-months") {
                initialDate = threeMonthsAgo;
              } else if (value === "last-12-months") {
                initialDate = twelveMonthsAgo;
              }
              setDate({ from: initialDate, to: today });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-4-weeks">Last 4 weeks</SelectItem>
              <SelectItem value="last-3-months">Last 3 months</SelectItem>
              <SelectItem value="last-12-months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
