import Link from "next/link";
import { FaMoneyBillWave } from "react-icons/fa";
export default function Logo() {
  return (
    <Link href="/" className="flex justify-center items-center gap-[0.65rem]">
      <FaMoneyBillWave className="text-primary size-7" />
      <div className="text-lg font-extrabold">WalletWiz</div>
    </Link>
  );
}
