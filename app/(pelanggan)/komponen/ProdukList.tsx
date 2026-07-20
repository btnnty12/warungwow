"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Produk, Kategori } from "@/lib/types";
import TombolTambahKeranjang from "./TombolTambahKeranjang";
import { Search } from "lucide-react";

type ProdukListProps = {
  produk: Produk[];
  kategori: Kategori[];
};

export default function ProdukList({ produk, kategori }: ProdukListProps) {
  const [selectedKategori, setSelectedKategori] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProduk = useMemo(() => {
    return produk.filter((item) => {
      const matchesKategori = selectedKategori
        ? item.kategori_id === selectedKategori
        : true;
      const matchesSearch = searchQuery
        ? (item.nama_produk || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;
      return matchesKategori && matchesSearch;
    });
  }, [produk, selectedKategori, searchQuery]);

  return (
    <>
      {/* Search & Filter */}
      <div className="pt-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari makanan, minuman, atau produk Mayora..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 rounded-full border border-gray-400 placeholder:text-gray-300 shadow-sm pl-14 pr-6 outline-none focus:border-2 focus:border-[#2F54EB]"
          />
          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 opacity-50 text-black"
          />
        </div>

        <div className="flex gap-5 mt-7 flex-wrap">
          <button
            onClick={() => setSelectedKategori(null)}
            className={`rounded-full px-7 py-3 font-semibold shadow transition ${
              !selectedKategori
                ? "bg-[#2F54EB] text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            Semua
          </button>
          {kategori?.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedKategori(item.id)}
              className={`rounded-full px-7 py-3 font-semibold shadow transition ${
                selectedKategori === item.id
                  ? "bg-[#2F54EB] text-white"
                  : "bg-white text-black hover:bg-gray-50"
              }`}
            >
              {item.nama_kategori}
            </button>
          ))}
        </div>
      </div>

      {/* Best Seller */}
      <section className="mt-12">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-bold text-black">Best Seller</h2>
          <button className="flex items-center gap-2 text-[#2F54EB] font-semibold hover:underline">
            Lihat Semua
            <span>›</span>
          </button>
        </div>

        <div className="grid grid-cols-6 gap-8 mt-8">
          {filteredProduk.slice(0, 6).map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative w-full h-[145px] bg-[#F6F6F6]">
                {item.gambar ? (
                  <Image
                    src={item.gambar}
                    alt={item.nama_produk || "Produk"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Tanpa Gambar
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-[16px] font-semibold text-black truncate">
                  {item.nama_produk}
                </h3>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-[#2F54EB] font-bold text-sm">
                    Rp {Number(item.harga)?.toLocaleString("id-ID")}
                  </p>
                  <TombolTambahKeranjang produk={item} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Menu */}
      <section className="mt-16">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-bold text-black">Menu</h2>
          <button className="flex items-center gap-2 text-[#2F54EB] font-semibold hover:underline">
            Lihat Semua
            <span>›</span>
          </button>
        </div>

        <div className="grid grid-cols-6 gap-8 mt-8">
          {filteredProduk.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative w-full h-[145px] bg-[#F6F6F6]">
                {item.gambar ? (
                  <Image
                    src={item.gambar}
                    alt={item.nama_produk || "Produk"}
                    fill
                    className="object-contain p-3"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Tanpa Gambar
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-[16px] font-semibold text-black truncate">
                  {item.nama_produk}
                </h3>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-[#2F54EB] font-bold">
                    Rp {Number(item.harga)?.toLocaleString("id-ID")}
                  </p>
                  <TombolTambahKeranjang produk={item} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
