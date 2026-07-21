"use client";

import Image from "next/image";
import { FileText } from "lucide-react";
import type { ItemKeranjang } from "@/lib/types";

type DetailPesananProps = {
  items: ItemKeranjang[];
  totalHarga: number;
};

export default function DetailPesanan({ items, totalHarga }: DetailPesananProps) {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-[#2F54EB] flex items-center gap-2 mb-4">
        <FileText size={28} />
        Detail Pesanan
      </h2>

      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <span className="font-bold text-lg">
          Order #WOW{Date.now().toString().slice(-6)}
        </span>
        <span className="text-gray-500 text-sm">
          {new Date().toLocaleDateString("id-ID")} |{" "}
          {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* Header Tabel */}
      <div className="grid grid-cols-12 mb-4 text-xs font-semibold text-gray-500 uppercase">
        <div className="col-span-1"></div>
        <div className="col-span-5">Menu</div>
        <div className="col-span-1 text-center">Qty</div>
        <div className="col-span-2 text-center">Harga</div>
        <div className="col-span-3 text-right">Subtotal</div>
      </div>

      {/* Item Pesanan */}
      {items.map((item, index) => {
        const harga = typeof item.harga === "string" ? parseFloat(item.harga) : item.harga || 0;
        const subtotal = harga * item.jumlah;
        return (
          <div key={item.produk_id || index} className="grid grid-cols-12 items-center py-3">
            <div className="col-span-1">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center">                {item.gambar ? (
                  <Image
                    src={item.gambar}
                    alt={item.nama_produk || "Produk"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-2xl">🍴</div>
                )}
              </div>
            </div>
            <div className="col-span-5 flex flex-col">
              <span className="font-semibold text-black">{item.nama_produk}</span>
            </div>
            <div className="col-span-1 text-center font-semibold">{item.jumlah}</div>
            <div className="col-span-2 text-center">
              Rp {harga.toLocaleString("id-ID")}
            </div>
            <div className="col-span-3 text-right font-semibold text-[#2F54EB]">
              Rp {subtotal.toLocaleString("id-ID")}
            </div>
          </div>
        );
      })}

      {/* Ringkasan */}
      <div className="mt-4 space-y-2 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between font-bold pt-3 border-t border-gray-200">
          <span>Total</span>
          <span className="text-[#2F54EB] text-lg">
            Rp {totalHarga.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}
