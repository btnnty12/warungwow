"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useKeranjang } from "@/lib/useKeranjang";

export default function KeranjangNavbar() {
  const { keranjang } = useKeranjang();
  const totalItem = keranjang.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <Link href="/keranjang" className="relative flex items-center justify-center">
      <ShoppingCart size={34} className="text-black" />
      {totalItem > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold">
          {totalItem}
        </span>
      )}
    </Link>
  );
}
