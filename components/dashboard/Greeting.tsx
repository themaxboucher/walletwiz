"use client";

import { useEffect, useState } from "react";

export default function Greeting() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();

      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    };

    setGreeting(getGreeting());
  }, []);

  return <span>{greeting}</span>;
}
