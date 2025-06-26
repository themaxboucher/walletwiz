import type { Metadata } from "next";
import "./globals.css";
import { Manrope as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "WalletWiz | Free Personal Finance Tracker & Budgeting App",
  description:
    "WalletWiz is a free personal finance tracker and budgeting app. Track spending, set savings goals, and manage all your accounts in one place—no spreadsheets needed.",
  keywords: [
    "free personal finance tracker",
    "budgeting app",
    "money management",
    "expense tracker",
    "track spending",
    "set savings goals",
    "manage finances online",
    "WalletWiz",
    "simple budgeting tool",
    "real-time balance tracker",
  ],
  openGraph: {
    title: "WalletWiz | Free Personal Finance Tracker & Budgeting App",
    description:
      "WalletWiz is a free personal finance tracker and budgeting app. Track spending, set savings goals, and manage all your accounts in one place—no spreadsheets needed.",
    url: "https://walletwiz.io/",
    siteName: "WalletWiz",
    images: [
      {
        url: "/open-graph.png",
        width: 1200,
        height: 630,
        alt: "WalletWiz logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/open-graph.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${fontSans.variable} antialiased font-sans overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
