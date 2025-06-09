import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function formatNumber(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function abbreviateNumber(value: number): string {
  const suffixes = ["", "k", "M", "B", "T"];
  const sign = Math.sign(value);
  const absValue = Math.abs(value);

  if (absValue < 1000) {
    return (sign * absValue).toString();
  }

  const tier = Math.floor(Math.log10(absValue) / 3);

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = absValue / scale;

  const formatted = scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1);

  return `${sign < 0 ? "-" : ""}${formatted}${suffix}`;
}

export const percentageChange = (
  currentValue: number,
  previousValue: number
) => {
  // Handle cases where previous value is zero to avoid division by zero
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : undefined;
  }
  // Calculate percentage change
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};
