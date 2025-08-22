export const dynamic = "force-dynamic";
import CTAButtons from "@/components/landing-page/CTAButtons";
import DisplayAccounts from "@/components/landing-page/DisplayAccounts";
import DisplayBalance from "@/components/landing-page/DisplayBalance";
import DisplayBudget from "@/components/landing-page/DisplayBudget";
import DisplayTransactions from "@/components/landing-page/DisplayTransactions";
import Footer from "@/components/landing-page/Footer";
import HeroImage from "@/components/landing-page/HeroImage";
import Navbar from "@/components/landing-page/Navbar";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Highlighter } from "@/components/magicui/highlighter";
import { Particles } from "@/components/magicui/particles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";

export default async function Home() {
  const loggedIn = await getLoggedInUser();

  return (
    <div className="bg-white dark:bg-background">
      <div className="absolute top-0 left-0 right-0 w-full h-20 rounded-b-full bg-primary/20 dark:bg-primary/10 mx-auto blur-3xl"></div>
      <Particles
        className="absolute inset-0 size-full"
        color="#0AC272"
        quantity={200}
        refresh
      />
      <div className="absolute inset-0 size-full bg-gradient-to-b from-transparent to-white dark:to-background" />
      <Navbar loggedIn={loggedIn} />
      <main>
        {/* Hero */}
        <section className="section-large pb-0 relative flex flex-col items-center justify-center">
          <div className="relative z-10 w-full max-w-[82rem] mx-auto flex flex-col items-center text-center">
            <div className="flex flex-col items-center px-4 sm:px-8">
              <BlurFade direction="up">
                <h1 className="heading-1 md:text-5xl lg:text-6xl max-w-[50rem] mt-4">
                  Track and budget your money{" "}
                  <Highlighter
                    action="underline"
                    color="#0AC272"
                    strokeWidth={3}
                  >
                    with ease.
                  </Highlighter>
                </h1>
              </BlurFade>
              <BlurFade direction="up" delay={0.2}>
                <p className="mt-5 max-w-[39rem] md:text-lg text-muted-foreground font-medium">
                  See all your income and expenses in one beautiful and simple
                  dashboard, so you always know where your money is going.
                </p>
              </BlurFade>
            </div>
            <BlurFade direction="up" delay={0.4}>
              <CTAButtons loggedIn={loggedIn} />
            </BlurFade>
            <div className="mt-14 w-full flex justify-center">
              <BlurFade direction="up" delay={0.6}>
                <HeroImage />
              </BlurFade>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="section-large pt-30 flex flex-col items-center text-center"
        >
          <div className="max-w-lg mb-12 flex flex-col items-center">
            <BlurFade direction="up" inView={true}>
              <h2 className="heading-2">How it works</h2>
            </BlurFade>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-9 gap-5 w-full">
            <BlurFade
              direction="up"
              inView={true}
              className="col-span-1 md:col-span-4"
            >
              <Card className="bg-muted/20 flex flex-col py-0 overflow-hidden gap-0 h-[25rem]">
                <div className="p-6 relative overflow-hidden h-full">
                  <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-12 bg-gradient-to-t from-white dark:from-background to-transparent" />
                  <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-12 bg-gradient-to-t from-muted/20 to-transparent" />
                  <DisplayAccounts />
                </div>
                <CardHeader className="py-6 text-left gap-2.5">
                  <div className="flex gap-2 items-center">
                    <CardTitle className="heading-4 flex items-center gap-2">
                      <span className="size-5.5 bg-primary/15 text-sm font-bold text-primary rounded-full flex items-center justify-center">
                        1
                      </span>{" "}
                      Add your accounts
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Add your bank accounts and credit cards (direct bank
                    integration coming soon).
                  </CardDescription>
                </CardHeader>
              </Card>
            </BlurFade>
            <BlurFade
              direction="up"
              inView={true}
              className="col-span-1 md:col-span-5"
            >
              <Card className="bg-muted/20 flex flex-col py-0 overflow-hidden gap-0 h-[25rem]">
                <div className="p-6 relative overflow-hidden h-full">
                  <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-12 bg-gradient-to-t from-white dark:from-background to-transparent" />
                  <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-12 bg-gradient-to-t from-muted/20 to-transparent" />
                  <DisplayBudget />
                </div>
                <CardHeader className="py-6 text-left gap-2.5">
                  <CardTitle className="heading-4 flex items-center gap-2">
                    <span className="size-5.5 bg-primary/15 text-sm font-bold text-primary rounded-full flex items-center justify-center">
                      2
                    </span>{" "}
                    Set budgets
                  </CardTitle>
                  <CardDescription className="text-base">
                    Set spending limits for different categories and track your
                    progress.
                  </CardDescription>
                </CardHeader>
              </Card>
            </BlurFade>
            <BlurFade
              direction="up"
              inView={true}
              className="col-span-1 md:col-span-5"
            >
              <Card className="bg-muted/20 flex flex-col py-0 overflow-hidden gap-0 h-[25rem]">
                <div className="p-6 relative overflow-hidden h-full">
                  <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-12 bg-gradient-to-t from-white dark:from-background to-transparent" />
                  <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-12 bg-gradient-to-t from-muted/20 to-transparent" />
                  <Card className="pt-0 absolute top-6 md:top-10 left-6 md:left-10 -right-4">
                    <DisplayTransactions />
                  </Card>
                </div>
                <CardHeader className="py-6 text-left gap-2.5">
                  <CardTitle className="heading-4 flex items-center gap-2">
                    <span className="size-5.5 bg-primary/15 text-sm font-bold text-primary rounded-full flex items-center justify-center">
                      3
                    </span>{" "}
                    Log your transactions
                  </CardTitle>
                  <CardDescription className="text-base">
                    Easily add and keep track of your transactions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </BlurFade>
            <BlurFade
              direction="up"
              inView={true}
              className="col-span-1 md:col-span-4"
            >
              <Card className="bg-muted/20 flex flex-col py-0 overflow-hidden gap-0 h-[25rem]">
                <div className="p-6 relative overflow-hidden h-full">
                  <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-12 bg-gradient-to-t from-white dark:from-background to-transparent" />
                  <div className="absolute z-10 bottom-0 left-0 right-0 w-full h-12 bg-gradient-to-t from-muted/20 to-transparent" />
                  <DisplayBalance />
                </div>
                <CardHeader className="py-6 text-left gap-2.5">
                  <CardTitle className="heading-4 flex items-center gap-2">
                    <span className="size-5.5 bg-primary/15 text-sm font-bold text-primary rounded-full flex items-center justify-center">
                      4
                    </span>{" "}
                    Track your money
                  </CardTitle>
                  <CardDescription className="text-base">
                    Get the full picture of your finances by seeing your
                    balances, budgets, and transactions all in one place.
                  </CardDescription>
                </CardHeader>
              </Card>
            </BlurFade>
          </div>
        </section>

        {/* About */}
        <section className="section-large pt-0">
          <BlurFade direction="up" inView={true}>
            <Card className="w-full bg-muted/20 p-6">
              <CardContent className="flex flex-col lg:flex-row gap-12 py-8">
                <div>
                  <Image
                    src="/max-profile.jpg"
                    alt="Max Boucher"
                    width={128}
                    height={128}
                    className="rounded-3xl size-32 object-cover shadow -rotate-4"
                  />
                </div>
                <div className="font-medium text-muted-foreground text-lg space-y-2">
                  <p>Hi 👋 I'm Max.</p>
                  <p>
                    I built WalletWiz because I wanted a simple way to track my
                    money. I hope you find it useful too!
                  </p>
                  <p>
                    I'm currently in the process of building the app, so please
                    bear with me as I fix bugs and add features.
                  </p>
                  <p>
                    If you have any feedback, please feel free to reach out to
                    me at{" "}
                    <a className="link" href="mailto:maxime@maximeboucher.com">
                      maxime@maximeboucher.com
                    </a>
                    .
                  </p>
                  <p className="font-semibold text-lg">- Max</p>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </section>
      </main>
      <Footer />
    </div>
  );
}
