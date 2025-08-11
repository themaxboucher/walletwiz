"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import AccountCard from "./AccounCard";

interface CardStackProps {
  accounts: Account[];
  transactions?: Transaction[];
  onCardClick?: (account: Account) => void;
  className?: string;
}

export default function CardStack({
  accounts,
  transactions,
  onCardClick,
  className,
}: CardStackProps) {
  const [stackOrder, setStackOrder] = useState<string[]>(
    accounts.map((account) => account.$id).filter(Boolean) as string[]
  );
  const [cardHeight, setCardHeight] = useState(256); // Default height
  const cardOffset = 70; // Offset between stacked cards
  const topCardRef = useRef<HTMLDivElement>(null);

  // Update stack order when accounts change
  useEffect(() => {
    const currentAccountIds = accounts
      .map((account) => account.$id)
      .filter(Boolean) as string[];
    setStackOrder((prev) => {
      // Keep existing order for accounts that still exist, add new ones to the front
      const existingIds = prev.filter((id) => currentAccountIds.includes(id));
      const newIds = currentAccountIds.filter((id) => !prev.includes(id));
      return [...newIds, ...existingIds];
    });
  }, [accounts]);

  // Measure the actual height of the top card
  useEffect(() => {
    if (topCardRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setCardHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(topCardRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [stackOrder]); // Re-run when stackOrder changes to ensure we're measuring the right card

  const bringToFront = (accountId: string) => {
    setStackOrder((prev) => {
      const filtered = prev.filter((id) => id !== accountId);
      return [accountId, ...filtered];
    });
  };

  return (
    <div
      className={`relative w-full transition-all duration-400 ease-out ${className}`}
      style={{
        height: `${cardHeight + (accounts.length - 1) * cardOffset}px`,
      }}
    >
      {stackOrder.map((accountId, index) => {
        const account = accounts.find((acc) => acc.$id === accountId);
        if (!account) return null;

        const stackIndex = stackOrder.length - 1 - index;
        const isTopCard = index === 0;

        return (
          <motion.div
            key={account.$id}
            ref={isTopCard ? topCardRef : undefined}
            layout
            className="absolute flex flex-col items-center w-full hover:cursor-pointer"
            style={{
              top: `${stackIndex * cardOffset}px`,
              zIndex: stackIndex + 1,
            }}
            transition={{
              type: "spring",
              bounce: 0.3,
              duration: 0.6,
            }}
            whileTap={!isTopCard ? { scale: 1.05 } : undefined}
            onClick={(e) => {
              e.stopPropagation();
              if (!isTopCard && account.$id) {
                bringToFront(account.$id);
              }
            }}
          >
            <AccountCard
              account={account}
              onClick={
                isTopCard && onCardClick
                  ? () => onCardClick(account)
                  : undefined
              }
              transactions={transactions}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
