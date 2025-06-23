import TransactionTable from "@/components/dashboard/TransactionTable";
import InfoBadge from "@/components/InfoBadge";
import CTAButtons from "@/components/landing-page/CTAButtons";
import DisplayAccounts from "@/components/landing-page/DisplayAccounts";
import DisplayBalance from "@/components/landing-page/DisplayBalance";
import DisplayBudget from "@/components/landing-page/DisplayBudget";
import DisplayTransactions from "@/components/landing-page/DisplayTransactions";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/landing-page/Navbar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import { HandCoins, Sparkle } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const loggedIn = await getLoggedInUser();

  return (
    <>
      <Navbar loggedIn={loggedIn} />
      <main className="px-4 sm:px-6">
        <div className="rounded-b-2xl w-full bg-gradient-to-t from-25% from-primary/15 to-transparent overflow-hidden relative">
          <div
            className={cn(
              "absolute inset-0 -z-2",
              "[background-size:20px_20px]",
              "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
              "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
            )}
          />
          <div className="absolute inset-0 -z-1 bg-gradient-to-b from-0% from-background to-15% to-transparent"></div>
          <section className="section-large flex flex-col items-center text-center pb-0 bg-radial-[at_50%_25%] from-background to-transparent to-65%">
            <div className="max-w-[42rem] flex flex-col items-center px-4 sm:px-8">
              <Badge className="px-3 text-sm text-foreground font-semibold rounded-lg mb-6 border border-primary/25 bg-transparent flex items-center gap-2">
                <HandCoins className="size-4 text-primary" />
                <h1>Free Financial Tracker</h1>
              </Badge>
              <h2 className="heading-1 md:text-5xl lg:text-[3.5rem]">
                Track and budget{" "}
                <span className="text-primary">your money</span> with ease.
              </h2>
              <p className="mt-4">
                WalletWiz lets you take control of your finances by showing you
                exactly exactly what's happening with your money.
              </p>
            </div>

            <CTAButtons loggedIn={loggedIn} />
            <div className="mt-12 w-full flex justify-center">
              <Image
                src="/walletwiz-dashboard.png"
                alt="WalletWiz dashboard"
                width={1400}
                height={700}
                className="rounded-t-xl shadow-2xl border border-b-0 w-full max-w-5xl"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </section>
        </div>
        <section
          id="features"
          className="section-large flex flex-col items-center text-center"
        >
          <div className="max-w-lg mb-12 flex flex-col items-center">
            <Badge className="px-3 text-sm text-foreground font-semibold rounded-lg mb-6 border border-primary/25 bg-transparent flex items-center gap-2">
              <Sparkle className="size-4 text-primary" />
              <h1>Features</h1>
            </Badge>
            <h2 className="heading-2">
              The basics you need to master your finances.
            </h2>
            <p className="mt-4">
              WalletWiz lets you take control of your finances by showing you
              exactly exactly what's happening with your money.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-9 gap-5 w-full">
            <Card className="col-span-1 md:col-span-5 flex flex-col py-0 overflow-hidden gap-0">
              <div className="p-6 bg-primary/10 relative overflow-hidden h-76">
                <Card className="pt-0 absolute top-10 left-10 -right-4">
                  <DisplayTransactions />
                </Card>
              </div>
              <CardHeader className="py-6 border-t border-border text-left gap-2">
                <CardTitle className="heading-4">
                  Keep track of transactions
                </CardTitle>
                <CardDescription>
                  WalletWiz lets you take control of your finances by showing
                  you exactly exactly what's happening with your money.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-1 md:col-span-4 flex flex-col py-0 overflow-hidden gap-0">
              <div className="p-6 bg-primary/10 relative overflow-hidden h-76">
                <DisplayBalance />
              </div>
              <CardHeader className="py-6 border-t border-border text-left gap-2">
                <CardTitle className="heading-4">
                  Monitor your balance
                </CardTitle>
                <CardDescription>
                  WalletWiz lets you take control of your finances by showing
                  you exactly exactly what's happening with your money.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-1 md:col-span-4 flex flex-col py-0 overflow-hidden gap-0">
              <div className="p-6 bg-primary/10 relative overflow-hidden h-76">
                <DisplayAccounts />
              </div>
              <CardHeader className="py-6 border-t border-border text-left gap-2">
                <div className="flex gap-2 items-center">
                  <CardTitle className="heading-4">
                    Connect your accounts
                  </CardTitle>
                  <InfoBadge>Soon</InfoBadge>
                </div>
                <CardDescription>
                  WalletWiz lets you take control of your finances by showing
                  you exactly exactly what's happening with your money.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-1 md:col-span-5 flex flex-col py-0 overflow-hidden gap-0">
              <div className="p-6 bg-primary/10 relative overflow-hidden h-76">
                <DisplayBudget />
              </div>
              <CardHeader className="py-6 border-t border-border text-left gap-2">
                <CardTitle className="heading-4">Create a budget</CardTitle>
                <CardDescription>
                  WalletWiz lets you take control of your finances by showing
                  you exactly exactly what's happening with your money.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
        <section className="section-large flex flex-col items-center text-center relative rounded-xl w-full bg-primary/10 border border-primary/25 my-10">
          <div
            className={cn(
              "absolute inset-0 -z-2",
              "[background-size:20px_20px]",
              "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
              "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
            )}
          />
          <div className="max-w-lg">
            <h2 className="heading-2">Get started in just 60 seconds.</h2>
            <p className="mt-4">
              WalletWiz lets you take control of your finances by showing you
              exactly exactly what's happening with your money.
            </p>
          </div>

          <CTAButtons loggedIn={loggedIn} />
        </section>
      </main>
      <Footer />
    </>
  );
}
