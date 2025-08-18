import type { Metadata } from "next";
import "./globals.css";
import { Manrope as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://walletwiz.io/"),
  title: "WalletWiz | Track and budget your money.",
  description:
    "WalletWiz let's you see all your income and expenses in one beautiful and simple dashboard, so you always know where your money is going.",
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
    title: "WalletWiz | Track and budget your money.",
    description:
      "WalletWiz let's you see all your income and expenses in one beautiful and simple dashboard, so you always know where your money is going.",
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
          <Toaster />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
