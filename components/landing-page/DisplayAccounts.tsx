import { institutions } from "@/constants";
import { createBrandfetchIconUrl } from "@/lib/utils";
import Image from "next/image";

export default function DisplayAccounts() {
  return (
    <div className="absolute inset-0 flex flex-wrap max-h-70 overflow-hidden justify-center gap-5 p-6 pt-8 w-fit mx-auto ">
      {institutions.map((inst) => (
        <div
          key={inst.name}
          className="flex size-16 items-center justify-center"
        >
          <Image
            src={createBrandfetchIconUrl(inst.domain, 120)}
            alt={inst.name}
            width={120}
            height={120}
            className="object-contain rounded-full border-2 border-white shadow-md"
            unoptimized // Necessary for brandfetch.io hotlinking guidelines
          />
        </div>
      ))}
    </div>
  );
}
