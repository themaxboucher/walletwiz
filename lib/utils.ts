import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays } from "date-fns";

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
    maximumFractionDigits: 0,
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
  if (previousValue === 0 || currentValue === 0) {
    return undefined;
  }
  // Calculate percentage change
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

// Transaction functions //

/**
 * Filters transactions by a given date range.
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  dateRange?: { from?: Date; to?: Date }
) {
  if (!dateRange?.from || !dateRange?.to) return transactions;
  const from = dateRange.from as Date;
  const to = dateRange.to as Date;
  return transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate >= from && txDate <= to;
  });
}

/**
 * Generates running balance chart data for all transactions within a date range.
 * Applies balance adjustment to align with actual account balances.
 */
export function generateBalanceChartData(
  transactions: Transaction[],
  dateRange?: { from?: Date; to?: Date },
  accounts?: Account[]
) {
  if (transactions.length === 0) return [];
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  let balance = 0;
  let txIndex = 0;
  const dates: Date[] = [];

  // Calculate balance adjustment (difference between account balances and transaction sums)
  const balanceAdjustment = accounts
    ? calculateTotalAccountBalance(accounts) -
      calculateTotalBalance(transactions)
    : 0;

  // Determine the date range to use
  const from = dateRange?.from
    ? new Date(dateRange.from)
    : new Date(sortedTransactions[0].date);
  const to = dateRange?.to
    ? new Date(dateRange.to)
    : new Date(sortedTransactions[sortedTransactions.length - 1].date);

  // Always generate a data point for every day in the range
  const currentDate = new Date(from);
  while (currentDate <= to) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates.map((date) => {
    while (
      txIndex < sortedTransactions.length &&
      new Date(sortedTransactions[txIndex].date) <= date
    ) {
      balance += sortedTransactions[txIndex].amount;
      txIndex++;
    }
    return {
      date: date.toISOString(),
      balance: balance + balanceAdjustment,
    };
  });
}

/**
 * Filters chart data by a given date range.
 */
export function filterChartDataByDateRange<T extends { date: string }>(
  chartData: T[],
  dateRange?: { from?: Date; to?: Date }
): T[] {
  if (!dateRange?.from || !dateRange?.to) return chartData;
  const from = dateRange.from as Date;
  const to = dateRange.to as Date;
  return chartData.filter((point) => {
    const pointDate = new Date(point.date);
    return pointDate >= from && pointDate <= to;
  });
}

/**
 * Calculates total income from a list of transactions.
 */
export function calculateIncome(transactions: Transaction[]) {
  return transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
}

/**
 * Calculates total expenses from a list of transactions.
 */
export function calculateExpenses(transactions: Transaction[]) {
  return transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}

/**
 * Calculates net change (income - expenses).
 */
export function calculateNetChange(income: number, expenses: number) {
  return income - expenses;
}

/**
 * Calculates total balance from all transactions up to a given date (defaults to today).
 */
export function calculateTotalBalance(
  transactions: Transaction[],
  upToDate?: Date
) {
  const date = upToDate ? new Date(upToDate) : new Date();
  date.setHours(23, 59, 59, 999);
  return transactions
    .filter((tx) => new Date(tx.date) <= date)
    .reduce((sum, tx) => sum + tx.amount, 0);
}

/**
 * Calculates total balance from all account balances.
 */
export function calculateTotalAccountBalance(accounts: Account[]) {
  return accounts.reduce(
    (sum, account) => sum + (account.currentBalance || 0),
    0
  );
}

/**
 * Calculates previous period metrics for comparison.
 */
export function calculatePreviousPeriodMetrics(
  transactions: Transaction[],
  dateRange?: { from?: Date; to?: Date }
) {
  if (!dateRange?.from || !dateRange?.to)
    return { previousIncome: 0, previousExpenses: 0, previousNetChange: 0 };
  const currentPeriodStart = dateRange.from as Date;
  const currentPeriodEnd = dateRange.to as Date;
  const durationMs = currentPeriodEnd.getTime() - currentPeriodStart.getTime();
  const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1);
  const previousPeriodStart = new Date(
    previousPeriodEnd.getTime() - durationMs
  );
  const previousPeriodTransactions = filterTransactionsByDateRange(
    transactions,
    { from: previousPeriodStart, to: previousPeriodEnd }
  );
  const previousIncome = calculateIncome(previousPeriodTransactions);
  const previousExpenses = calculateExpenses(previousPeriodTransactions);
  const previousNetChange = previousIncome - previousExpenses;
  return { previousIncome, previousExpenses, previousNetChange };
}

/**
 * Returns a human-readable period text for a given date range.
 */
export function getPeriodText(dateRange?: { from?: Date; to?: Date }) {
  if (!dateRange?.from || !dateRange?.to) return "period";
  const start = dateRange.from;
  const end = dateRange.to;
  const totalDays = differenceInDays(end, start) + 1;
  if (totalDays === 7) return "week";
  if (totalDays === 30 || totalDays === 31) return "month";
  if (totalDays === 90 || totalDays === 91 || totalDays === 92)
    return "3 months";
  if (
    totalDays === 180 ||
    totalDays === 181 ||
    totalDays === 182 ||
    totalDays === 183
  )
    return "6 months";
  if (totalDays === 365 || totalDays === 366) return "year";
  return `${totalDays} days`;
}

/**
 * Filters data by a given end date and time range string (e.g., 1W, 1M, etc.).
 */
export function filterByRange<T extends { date: string }>(
  data: T[],
  lastDate: Date,
  range: string
): T[] {
  if (!data.length || range === "ALL") return data;
  const end = new Date(lastDate);
  let fromDate;
  switch (range) {
    case "1W":
      fromDate = new Date(end);
      fromDate.setDate(fromDate.getDate() - 6);
      break;
    case "1M":
      fromDate = new Date(end);
      fromDate.setMonth(fromDate.getMonth() - 1);
      fromDate.setDate(fromDate.getDate() + 1);
      break;
    case "3M":
      fromDate = new Date(end);
      fromDate.setMonth(fromDate.getMonth() - 3);
      fromDate.setDate(fromDate.getDate() + 1);
      break;
    case "6M":
      fromDate = new Date(end);
      fromDate.setMonth(fromDate.getMonth() - 6);
      fromDate.setDate(fromDate.getDate() + 1);
      break;
    case "YTD":
      fromDate = new Date(end.getFullYear(), 0, 1);
      break;
    case "1Y":
      fromDate = new Date(end);
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      fromDate.setDate(fromDate.getDate() + 1);
      break;
    default:
      return data;
  }
  return data.filter(
    (item) => new Date(item.date) >= fromDate && new Date(item.date) <= end
  );
}

/**
 * Returns the start date for a given time range and transaction list.
 * For 'ALL', returns the date of the oldest transaction.
 */
export function getRangeStartDate(
  lastDate: Date,
  range: string,
  transactions: Transaction[]
) {
  if (range === "ALL") {
    // Oldest transaction date
    if (transactions.length === 0) return new Date(lastDate);
    return new Date(
      Math.min(...transactions.map((tx) => new Date(tx.date).getTime()))
    );
  }
  // Replicate logic from filterByRange for other ranges
  const end = new Date(lastDate);
  let fromDate;
  switch (range) {
    case "1W":
      fromDate = new Date(end);
      fromDate.setDate(fromDate.getDate() - 6);
      break;
    case "1M":
      fromDate = new Date(end);
      fromDate.setMonth(fromDate.getMonth() - 1);
      fromDate.setDate(fromDate.getDate() + 1);
      break;
    case "3M":
      fromDate = new Date(end);
      fromDate.setMonth(fromDate.getMonth() - 3);
      fromDate.setDate(fromDate.getDate() + 1);
      break;
    case "6M":
      fromDate = new Date(end);
      fromDate.setMonth(fromDate.getMonth() - 6);
      fromDate.setDate(fromDate.getDate() + 1);
      break;
    case "YTD":
      fromDate = new Date(end.getFullYear(), 0, 1);
      break;
    case "1Y":
      fromDate = new Date(end);
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      fromDate.setDate(fromDate.getDate() + 1);
      break;
    default:
      fromDate = new Date(end);
  }
  return fromDate;
}

/**
 * Sorts categories so 'Other Income' and 'Other Expense' are at the end, and the rest alphabetically.
 */
export function sortCategories(categories: Category[]): Category[] {
  const mainCategories = categories
    .filter(
      (cat) => cat.name !== "Other Income" && cat.name !== "Other Expense"
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  return [
    ...mainCategories,
    ...categories.filter((cat) => cat.name === "Other Income"),
    ...categories.filter((cat) => cat.name === "Other Expense"),
  ];
}

// Brandfetch Logo Functions //

/**
 * Creates a Brandfetch logo URL from a domain using the Logo Link feature
 * @param domain - The domain of the brand (e.g., "apple.com", "amazon.com")
 * @param options - Optional configuration for the logo
 * @returns The Brandfetch logo URL
 */
export const createBrandfetchLogoUrl = (
  domain: string,
  options: {
    type?: "icon" | "logo" | "symbol";
    theme?: "light" | "dark";
    fallback?: boolean;
    width?: number;
    height?: number;
  } = {}
): string => {
  const clientId = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID;
  const { type = "icon", theme, fallback = true, width, height } = options;

  // Use the simple Logo Link format - it handles fallbacks internally
  let url = `https://cdn.brandfetch.io/${domain}`;

  // Add query parameters
  const params = new URLSearchParams();
  if (clientId) params.append("c", clientId);
  if (theme) params.append("theme", theme);
  if (width) params.append("w", width.toString());
  if (height) params.append("h", height.toString());

  return `${url}?${params.toString()}`;
};

/**
 * Creates a Brandfetch logo URL optimized for icons (small, square format)
 * @param domain - The domain of the brand
 * @param size - Size in pixels (defaults to 128)
 * @returns The Brandfetch icon URL
 */
export const createBrandfetchIconUrl = (
  domain: string,
  size: number = 128
): string => {
  return createBrandfetchLogoUrl(domain, {
    type: "icon",
    width: size,
    height: size,
    fallback: true,
  });
};

/**
 * Creates a Brandfetch logo URL for horizontal logos with theme support
 * @param domain - The domain of the brand
 * @param theme - Light or dark theme (optional)
 * @param height - Height in pixels (optional)
 * @returns The Brandfetch logo URL
 */
export const createBrandfetchLogoUrlWithTheme = (
  domain: string,
  theme?: "light" | "dark",
  height?: number
): string => {
  return createBrandfetchLogoUrl(domain, {
    type: "logo",
    theme,
    height,
    fallback: true,
  });
};

// Account Icon Helper //

/**
 * Determines what icon/logo to display for an account based on priority:
 * 1. AccountType brandDomain (if available)
 * 2. Institution domain (if available)
 * 3. AccountType icon (if available)
 * 4. Landmark icon (fallback)
 */
export interface AccountIconResult {
  type: "brandfetch" | "icon";
  value: string; // Either domain for brandfetch or icon name for Lucide icon
}

export const getAccountIcon = (account: Account): AccountIconResult => {
  // Priority 1: AccountType brandDomain
  if (account.type?.brandDomain) {
    return {
      type: "brandfetch",
      value: account.type.brandDomain,
    };
  }

  // Priority 2: Institution domain
  if (account.institution?.domain) {
    return {
      type: "brandfetch",
      value: account.institution.domain,
    };
  }

  // Priority 3: AccountType icon
  if (account.type?.iconName) {
    return {
      type: "icon",
      value: account.type.iconName,
    };
  }

  // Priority 4: Fallback to Landmark
  return {
    type: "icon",
    value: "Landmark",
  };
};
