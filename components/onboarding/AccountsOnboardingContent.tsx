"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import AccountsOnboardingForm from "./AccountsOnboardingForm";
import CardStack from "../dashboard/CardStack";
import { BlurFade } from "../magicui/blur-fade";

interface AccountsOnboardingContentProps {
  user: User;
  accounts: Account[];
}

export default function AccountsOnboardingContent({
  user,
  accounts: initialAccounts,
}: AccountsOnboardingContentProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleAddAccount = (newAccount: Account) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 1; // 1px tolerance
      const isTop = scrollTop <= 1; // 1px tolerance
      setIsAtBottom(isBottom);
      setIsAtTop(isTop);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // Check initial position
      handleScroll();

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [accounts]); // Re-run when accounts change to check new scroll position

  useLayoutEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const updateEdgeStates = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const atTop = scrollTop <= 1;
      setIsAtTop(atTop);
      setIsAtBottom(atBottom);
    };

    // After layout/measure, compute once
    requestAnimationFrame(updateEdgeStates);

    // Recompute on size/content changes
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(updateEdgeStates);
    });
    mutationObserver.observe(element, { childList: true, subtree: true });

    const onResize = () => requestAnimationFrame(updateEdgeStates);
    window.addEventListener("resize", onResize);

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [accounts]);

  const canContinue = accounts.length >= 1;

  return (
    <div className="w-full max-w-4xl space-y-10 min-h-[28rem] flex flex-col justify-between my-4">
      <div className="flex flex-col items-center text-center gap-1">
        <BlurFade direction="up" className="space-y-2">
          <h1 className="heading-3">Add your financial accounts</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Add a bank account or credit card to get started.
          </p>
        </BlurFade>
        <div className="flex items-center gap-1.5 mt-6">
          <div className="h-1.5 w-8 bg-primary rounded-full" />
          <div className="h-1.5 w-8 bg-primary/20 rounded-full" />
          <div className="h-1.5 w-8 bg-primary/20 rounded-full" />
        </div>
      </div>

      <BlurFade direction="up" delay={0.2}>
        <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-10 mt-4">
          <AccountsOnboardingForm userId={user.$id} onAdd={handleAddAccount} />
          {accounts.length == 0 && (
            <div className="aspect-[1.75] w-full max-w-md border-2 border-dashed rounded-xl flex justify-center items-center">
              <p className="text-sm text-muted-foreground">
                Add your first account to get started.
              </p>
            </div>
          )}
          {accounts.length > 0 && (
            <div
              ref={scrollContainerRef}
              className="relative h-full max-h-80 overflow-y-auto no-scrollbar mb-2"
            >
              <div
                className={`sticky z-50 top-0 left-0 right-0 w-full h-12 bg-gradient-to-b from-background to-transparent pointer-events-none transition-opacity duration-300 ${
                  isAtTop ? "opacity-0" : "opacity-100"
                }`}
              />
              <div className="px-6">
                <CardStack
                  accounts={accounts}
                  className="-mb-12 -mt-9"
                  shadows={false}
                />
              </div>
              <div
                className={`sticky z-50 bottom-0 left-0 right-0 w-full h-12 bg-gradient-to-t from-background to-transparent pointer-events-none transition-opacity duration-300 ${
                  isAtBottom ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          )}
        </div>
      </BlurFade>

      <div className="flex justify-end gap-3 pt-2">
        {canContinue ? (
          <Button asChild>
            <Link href="/onboarding/categories">Continue</Link>
          </Button>
        ) : (
          <Button disabled>Continue</Button>
        )}
      </div>
    </div>
  );
}
