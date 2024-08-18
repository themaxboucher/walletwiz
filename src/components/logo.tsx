import Link from "next/link";
import { FaMoneyBillWave } from "react-icons/fa";
export default function Logo() {
  return (
    <Link href="/" className="flex justify-center items-center gap-3">
      <FaMoneyBillWave className="text-primary size-7" />
      <div className="text-lg font-bold">WalletWiz</div>
    </Link>
  );
}
