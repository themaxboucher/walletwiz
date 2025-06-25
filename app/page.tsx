import InfoBadge from "@/components/InfoBadge";
import CTAButtons from "@/components/landing-page/CTAButtons";
import DisplayAccounts from "@/components/landing-page/DisplayAccounts";
import DisplayBalance from "@/components/landing-page/DisplayBalance";
import DisplayBudget from "@/components/landing-page/DisplayBudget";
import DisplayTransactions from "@/components/landing-page/DisplayTransactions";
import Footer from "@/components/landing-page/Footer";
import HeroImage from "@/components/landing-page/HeroImage";
import Navbar from "@/components/landing-page/Navbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import { HandCoins, Zap } from "lucide-react";
import ShrinkingHeroBg from "@/components/landing-page/ShrinkingHeroBg";

export default async function Home() {
  const loggedIn = await getLoggedInUser();

  return (
    <>
      <Navbar loggedIn={loggedIn} />
      <main>
        {/* Hero */}
        <section className="section-large pb-0 relative flex flex-col items-center justify-center">
          <ShrinkingHeroBg />
          <div className="relative z-10 w-full max-w-[82rem] mx-auto flex flex-col items-center text-center">
            <div className="max-w-[42rem] flex flex-col items-center px-4 sm:px-8">
              <div className="uppercase text-primary text-sm font-semibold rounded-xl flex items-center gap-2 mb-5">
                <HandCoins className="size-4 text-primary" />
                <h1>Free Financial Tracker</h1>
              </div>
              <h2 className="heading-1 md:text-5xl lg:text-[3.5rem]">
                Track and budget{" "}
                <span className="text-primary">your money</span> with ease.
              </h2>
              <p className="mt-4">
                WalletWiz is the magic money manager that makes mastering your
                money effortless and enjoyable.
              </p>
            </div>

            <CTAButtons loggedIn={loggedIn} />
            <div className="mt-12 w-full flex justify-center">
              <HeroImage />
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="section-large flex flex-col items-center text-center"
        >
          <div className="max-w-lg mb-12 flex flex-col items-center">
            <div className="uppercase text-primary text-sm font-semibold rounded-xl flex items-center gap-2 mb-5">
              <Zap className="size-4 text-primary" />
              <h2>Features</h2>
            </div>
            <h2 className="heading-2">
              The basics you need to master your finances.
            </h2>
            <p className="mt-4">
              WalletWiz is you magic money manager that makes mastering your
              money a breeze.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-9 gap-5 w-full">
            <Card className="col-span-1 md:col-span-5 flex flex-col py-0 overflow-hidden gap-0 bg-transparent">
              <div className="p-6 bg-primary/20 relative overflow-hidden h-76">
                <Card className="pt-0 absolute top-10 left-10 -right-4">
                  <DisplayTransactions />
                </Card>
              </div>
              <CardHeader className="py-6 border-t border-border text-left gap-2 bg-card">
                <CardTitle className="heading-4">
                  Keep track of transactions
                </CardTitle>
                <CardDescription>
                  WalletWiz lets you take control of your finances by showing
                  you exactly exactly what's happening with your money.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-1 md:col-span-4 flex flex-col py-0 overflow-hidden gap-0 bg-transparent">
              <div className="p-6 bg-primary/20 relative overflow-hidden h-76">
                <DisplayBalance />
              </div>
              <CardHeader className="py-6 border-t border-border text-left gap-2 bg-card">
                <CardTitle className="heading-4">
                  Monitor your balance
                </CardTitle>
                <CardDescription>
                  WalletWiz lets you take control of your finances by showing
                  you exactly exactly what's happening with your money.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-1 md:col-span-4 flex flex-col py-0 overflow-hidden gap-0 bg-transparent">
              <div className="p-6 bg-primary/20 relative overflow-hidden h-76">
                <DisplayAccounts />
              </div>
              <CardHeader className="py-6 border-t border-border text-left gap-2 bg-card">
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
            <Card className="col-span-1 md:col-span-5 flex flex-col py-0 overflow-hidden gap-0 bg-transparent">
              <div className="p-6 bg-primary/20 relative overflow-hidden h-76">
                <DisplayBudget />
              </div>
              <CardHeader className="py-6 border-t border-border text-left gap-2 bg-card">
                <CardTitle className="heading-4">Create a budget</CardTitle>
                <CardDescription>
                  WalletWiz lets you take control of your finances by showing
                  you exactly exactly what's happening with your money.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="section-large pt-0">
          <Card className="p-24 flex flex-col items-center text-center relative rounded-2xl overflow-hidden w-full bg-transparent">
            <div className="absolute inset-0 -z-3 bg-card"></div>
            <div
              className={cn(
                "absolute inset-0 -z-2",
                "[background-size:20px_20px]",
                "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
              )}
            />
            <div className="absolute inset-0 -z-1 bg-radial-[at_50%_40%] from-card to-primary/20"></div>
            <div className="max-w-lg">
              <h2 className="heading-2">Get started in just 60 seconds.</h2>
              <p className="mt-4">
                WalletWiz lets you take control of your finances by showing you
                exactly exactly what's happening with your money.
              </p>
            </div>
            <CTAButtons loggedIn={loggedIn} />
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
