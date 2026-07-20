"use client";

import { useKeranjang } from "@/lib/useKeranjang";
import { Produk } from "@/lib/types";

type Props = {
  produk: Produk;
};

export default function TombolTambahKeranjang({ produk }: Props) {
  const { tambahKeKeranjang } = useKeranjang();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        console.log("Tombol diklik, produk:", produk);
        tambahKeKeranjang({
          produk_id: produk.id,
          nama_produk: produk.nama_produk ?? "",
          harga: Number(produk.harga ?? 0),
          gambar: produk.gambar,
          jumlah: 1,
        });
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