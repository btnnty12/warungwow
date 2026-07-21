"use client";

import { useRef } from "react";
import { useKeranjang } from "@/lib/useKeranjang";
import { Produk } from "@/lib/types";
import { useToast } from "./Toast";
import { useKeranjangIcon } from "./KeranjangIconContext";

type Props = {
  produk: Produk;
};

export default function TombolTambahKeranjang({ produk }: Props) {
  const { tambahKeKeranjang } = useKeranjang();
  const { showToast, triggerFlyingAnimation } = useToast();
  const { keranjangIconRef } = useKeranjangIcon();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        console.log("Tombol diklik, produk:", produk);
        tambahKeKeranjang({
          produk_id: produk.id,
          nama_produk: produk.nama_produk ?? "",
          harga: Number(produk.harga ?? 0),
          gambar: produk.gambar ?? "",
          jumlah: 1,
        });
        
        // Dapatkan posisi tombol dan ikon keranjang
        if (buttonRef.current && keranjangIconRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          const cartRect = keranjangIconRef.current.getBoundingClientRect();
          
          triggerFlyingAnimation(
            produk.gambar ?? "",
            { x: buttonRect.left, y: buttonRect.top },
            { x: cartRect.left, y: cartRect.top }
          );  
        }
        
        showToast("Produk berhasil ditambahkan ke keranjang");
      }}
      className="
        w-8 h-8
        rounded-full
        bg-[#2F54EB]
        text-white
        font-bold
        flex items-center
        justify-center
        cursor-pointer
        z-10
        relative
      "
    >
      +
    </button>
  );
}