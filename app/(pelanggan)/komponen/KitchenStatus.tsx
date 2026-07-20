"use client";

import { User } from "lucide-react";

type KitchenStatusProps = {
  status?: "dibuat" | "selesai";
};

export default function KitchenStatus({ status = "dibuat" }: KitchenStatusProps) {
  return (
    <div className="bg-orange-100 border border-orange-200 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
      <div className="w-40 h-40 bg-orange-200 rounded-2xl overflow-hidden flex items-center justify-center">
        <User size={80} className="text-orange-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-orange-600 mb-2">
          {status === "selesai" ? "Pesanan Selesai!" : "Kitchen sedang membuat pesanan anda"}
        </h3>
        <p className="text-orange-800 text-sm leading-relaxed">
          {status === "selesai"
            ? "Terima kasih sudah memesan di Warung WOW! Selamat menikmati."
            : "Pesanan Anda sedang dibuatkan dengan bahan terbaik. Mohon tunggu sebentar ya!"}
        </p>
      </div>
    </div>
  );
}
