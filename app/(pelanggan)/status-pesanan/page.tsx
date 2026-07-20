"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, FileText, Table } from "lucide-react";
import DetailPesanan from "../komponen/DetailPesanan";
import TimelinePesanan from "../komponen/TimelinePesanan";
import KitchenStatus from "../komponen/KitchenStatus";

export default function StatusPesananPage() {
  const { keranjang, totalHarga, kosongkanKeranjang } = useKeranjang();

  // Fallback ke contoh data jika keranjang kosong
  const displayItems = keranjang.length > 0 ? keranjang : [
    { id: 1, nama_produk: "Nasi Goreng Spesial", harga: 28000, jumlah: 1 },
    { id: 2, nama_produk: "Ayam Geprek", harga: 23000, jumlah: 1 },
    { id: 3, nama_produk: "Es Teh Manis", harga: 6000, jumlah: 2 },
  ] as any;

  const displayTotal = keranjang.length > 0 ? totalHarga : 62000;

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      {/* ================= CONTAINER ================= */}
      <section className="max-w-7xl mx-auto bg-white rounded-[28px] px-10 pb-10 mt-8 shadow-xl">
        {/* ================= NAVBAR ================= */}
        <nav className="h-24 flex items-center justify-between border-b border-gray-100">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Warung WOW"
              width={120}
              height={90}
              priority
            />
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-14">
            <Link
              href="/"
              className="font-semibold text-black hover:text-[#2F54EB]"
            >
              Beranda
            </Link>
            <Link
              href="/menu"
              className="font-semibold text-black hover:text-[#2F54EB]"
            >
              Menu
            </Link>
          </div>

          {/* Keranjang */}
          <Link
            href="/keranjang"
            className="relative flex items-center justify-center"
          >
            <ShoppingCart size={34} className="text-black" />
            {keranjang.length > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold">
                {keranjang.reduce((sum, item) => sum + item.jumlah, 0)}
              </span>
            )}
          </Link>
        </nav>

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#2F54EB] flex items-center justify-center">
              <FileText size={32} className="text-white" />
            </div>
            <h1 className="text-[36px] font-extrabold text-black">
              Status Pesanan
            </h1>
          </div>

          {/* Badge Meja */}
          <div className="bg-[#2F54EB] rounded-full px-5 py-2 flex items-center gap-2">
            <Table size={24} className="text-white" />
            <span className="text-white font-semibold text-sm">
              {typeof window !== "undefined"
                ? localStorage.getItem("nomorMeja") || "No Meja"
                : "No Meja"}
            </span>
          </div>
        </div>

        {/* ================= CONTENT ATAS ================= */}
        <div className="grid grid-cols-12 gap-6 mt-8">
          <div className="col-span-7">
            <DetailPesanan items={displayItems} totalHarga={displayTotal} />
          </div>
          <div className="col-span-5">
            {/* Placeholder untuk status pembayaran selesai */}
            <div className="border border-gray-200 rounded-2xl p-6 h-full shadow-lg flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-600">Pembayaran Berhasil!</h3>
                  <p className="text-sm text-gray-500">
                    Pesanan Anda sedang diproses oleh dapur
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  kosongkanKeranjang();
                  window.location.href = "/";
                }}
                className="w-full mt-6 h-12 rounded-xl bg-[#2F54EB] text-white font-bold text-base hover:bg-blue-700 transition"
              >
                Pesan Lagi
              </button>
            </div>
          </div>
        </div>

        {/* ================= CONTENT BAWAH: TRACK & KITCHEN ================= */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-7">
            <TimelinePesanan />
          </div>
          <div className="col-span-5">
            <KitchenStatus />
          </div>
        </div>
      </section>
    </main>
  );
}
