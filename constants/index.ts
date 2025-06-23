import {
  DollarSign,
  Home,
  ShoppingCart,
  Lightbulb,
  Car,
  ShoppingBag,
  Briefcase,
  Utensils,
  Smartphone,
  Music,
  PiggyBank,
  BanknoteArrowUp,
  BanknoteArrowDown,
  LucideIcon,
} from "lucide-react";

export const categoryColors: Record<CategoryColor, string> = {
  red: "text-red-500",
  yellow: "text-yellow-500",
  orange: "text-orange-500",
  blue: "text-blue-500",
  violet: "text-violet-500",
  pink: "text-pink-500",
  green: "text-primary",
};

export const categoryIcons: Record<string, LucideIcon> = {
  DollarSign,
  Home,
  ShoppingCart,
  Lightbulb,
  Car,
  ShoppingBag,
  Briefcase,
  Utensils,
  Smartphone,
  Music,
  PiggyBank,
  BanknoteArrowUp,
  BanknoteArrowDown,
};

export const categories: Category[] = [
  {
    name: "Salary",
    color: "blue",
    iconName: "Briefcase",
    type: "income",
  },
  {
    name: "Other Income",
    color: "green",
    iconName: "BanknoteArrowUp",
    type: "income",
  },
  {
    name: "Housing",
    color: "red",
    iconName: "Home",
    type: "expense",
  },
  {
    name: "Groceries",
    color: "blue",
    iconName: "ShoppingCart",
    type: "expense",
  },
  {
    name: "Utilities",
    color: "yellow",
    iconName: "Lightbulb",
    type: "expense",
  },
  {
    name: "Transport",
    color: "violet",
    iconName: "Car",
    type: "expense",
  },
  {
    name: "Shopping",
    color: "pink",
    iconName: "ShoppingBag",
    type: "expense",
  },
  {
    name: "Entertainment",
    color: "orange",
    iconName: "Music",
    type: "expense",
  },
  {
    name: "Other Expense",
    color: "red",
    iconName: "BanknoteArrowDown",
    type: "expense",
  },
];

export const displayTransactions: Transaction[] = [
  {
    $id: 1,
    merchantName: "Tim Hortons",
    amount: -4.25,
    account: "Credit Card",
    category: {
      name: "Food and beverage",
      iconName: "Utensils",
      color: "orange",
      type: "expense",
    },
    date: "2025-06-02",
    merchantLogo:
      "https://img.logo.dev/timhortons.ca?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    $id: 2,
    merchantName: "Wealthsimple",
    amount: 3000,
    account: "Checking",
    category: {
      name: "Salary",
      iconName: "Briefcase",
      color: "blue",
      type: "income",
    },
    date: "2025-06-06",
    merchantLogo:
      "https://img.logo.dev/wealthsimple.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    $id: 4,
    merchantName: "Uber",
    amount: -13.25,
    account: "Credit Card",
    category: {
      name: "Transport",
      iconName: "Car",
      color: "violet",
      type: "expense",
    },
    date: "2025-06-04",
    merchantLogo:
      "https://img.logo.dev/uber.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    $id: 5,
    merchantName: "Rogers",
    amount: -85.0,
    account: "Checking",
    category: {
      name: "Utilities",
      iconName: "Smartphone",
      color: "yellow",
      type: "expense",
    },
    date: "2025-06-05",
    merchantLogo: "https://logo.clearbit.com/rogers.com",
  },
  {
    $id: 3,
    merchantName: "Shoppers Drug Mart",
    amount: -32.75,
    account: "Credit Card",
    category: {
      name: "Shopping",
      iconName: "ShoppingBag",
      color: "pink",
      type: "expense",
    },
    date: "2025-06-03",
    merchantLogo: "https://logo.clearbit.com/shoppersdrugmart.ca",
  },
];

export const institutions = [
  {
    name: "RBC",
    url: "https://img.logo.dev/rbccm.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "TD Canada Trust",
    url: "https://img.logo.dev/td.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Scotiabank",
    url: "https://img.logo.dev/scotiabank.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "BMO",
    url: "https://img.logo.dev/bmo.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "CIBC",
    url: "https://img.logo.dev/cibc.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "National Bank",
    url: "https://img.logo.dev/fbngp.ca?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Desjardins",
    url: "https://img.logo.dev/desjardins.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "EQ Bank",
    url: "https://img.logo.dev/eqbank.ca?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Wealthsimple",
    url: "https://img.logo.dev/wealthsimple.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Tangerine",
    url: "https://img.logo.dev/tangerine.ca?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Chase",
    url: "https://img.logo.dev/chase.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Bank of America",
    url: "https://img.logo.dev/bankofamerica.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Wells Fargo",
    url: "https://img.logo.dev/wellsfargo.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Citi",
    url: "https://img.logo.dev/citibankonline.pl?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Capital One",
    url: "https://img.logo.dev/capitalone.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Ally",
    url: "https://img.logo.dev/ally.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "SoFi",
    url: "https://img.logo.dev/sofi.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
  {
    name: "Robinhood",
    url: "https://img.logo.dev/robinhood.com?token=pk_aIln8e6dSBC2g0xYnOuCiA",
  },
];
