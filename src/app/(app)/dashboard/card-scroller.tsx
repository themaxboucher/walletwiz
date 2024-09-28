"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollerProps {
  children: ReactNode;
}

export default function CardScroller({ children }: ScrollerProps) {
  const [showLeftArrow, setShowleftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // Check if the list of cards is enough to be scrollable
  useEffect(() => {
    const checkIsScrollable = () => {
      if (parentRef.current && sliderRef.current) {
        const parentWidth = parentRef.current.clientWidth;
        const sliderWidth = sliderRef.current.clientWidth;

        if (sliderWidth >= parentWidth) {
          setShowRightArrow(true);
        } else {
          setShowRightArrow(false);
        }
      }
    };

    checkIsScrollable();

    // Check again whenever the window changes size
    window.addEventListener("resize", checkIsScrollable);
    return () => {
      window.removeEventListener("resize", checkIsScrollable);
    };
  }, []);

  function scrollHandler(event: React.UIEvent<HTMLDivElement>) {
    const slider = event.target as HTMLElement;
    if (slider.scrollLeft === 0) {
      setShowleftArrow(false);
    } else if (
      Math.abs(slider.scrollLeft - (slider.scrollWidth - slider.clientWidth)) <=
      1
    ) {
      setShowRightArrow(false);
    } else {
      setShowRightArrow(true);
      setShowleftArrow(true);
    }
  }

  function scrollLeftHandler() {
    const slider = document.getElementById("slider")!;
    slider.scrollLeft = slider.scrollLeft - 600;
  }

  function scrollRightHandler() {
    const slider = document.getElementById("slider")!;
    slider.scrollLeft = slider.scrollLeft + 600;
  }

  return (
    <div
      className="flex justify-between items-center relative w-full group"
      ref={parentRef}
    >
      <div
        id="slider"
        className="flex justify-start items-center gap-4 no-scrollbar overflow-x-scroll scroll-smooth h-full w-full"
        onScroll={scrollHandler}
        ref={sliderRef}
      >
        {children}
      </div>
      {showRightArrow && (
        <div className="absolute right-0 inset-y-0 z-10 h-full w-24 bg-gradient-to-r from-transparent to-background pointer-events-none"></div>
      )}
      {showRightArrow && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full absolute z-20 -right-4 inset-y-auto size-8 hidden group-hover:flex"
          onClick={scrollRightHandler}
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
      {showLeftArrow && (
        <div className="absolute left-0 inset-y-0 z-10 h-full w-24 bg-gradient-to-l from-transparent to-background pointer-events-none"></div>
      )}
      {showLeftArrow && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full absolute z-20 -left-4 inset-y-auto size-8 hidden group-hover:flex"
          onClick={scrollLeftHandler}
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}
    </div>
  );
}
