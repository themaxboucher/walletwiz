import { useRef, useEffect } from "react";
import CountUp from "react-countup";

interface AmountCountUpProps {
  amount: number;
  formattingFn: (n: number) => string;
}

export default function AmountCountUp({
  amount,
  formattingFn,
}: AmountCountUpProps) {
  const prevAmountRef = useRef(amount);
  const start = prevAmountRef.current;
  useEffect(() => {
    prevAmountRef.current = amount;
  }, [amount]);
  return (
    <CountUp
      start={start}
      end={amount}
      duration={1.2}
      separator=","
      decimals={2}
      formattingFn={formattingFn}
    />
  );
}
