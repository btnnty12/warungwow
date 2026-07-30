"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  FileText,
  Table,
  Plus,
  Trash2,
  History,
  Home,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useRiwayatPesanan, RiwayatPesanan } from "@/lib/useRiwayatPesanan";
import { useMeja } from "@/lib/useMeja";
import DetailPesanan from "../komponen/DetailPesanan";
import TimelinePesanan from "../komponen/TimelinePesanan";
import KitchenStatus from "../komponen/KitchenStatus";
import { useState } from "react";

const statusStyle: Record<string, string> = {
  "Menunggu Konfirmasi": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Sedang Diproses": "bg-orange-100 text-orange-700 border-orange-200",
  Selesai: "bg-green-100 text-green-700 border-green-200",
  Dibatalkan: "bg-red-100 text-red-700 border-red-200",
};

export default function StatusPesananPage() {
  const { riwayat, pesananTerbaru, pesanLagi, hapusRiwayat } = useRiwayatPesanan();
  const { nomorMeja } = useMeja();
  const [selectedId, setSelectedId] = useState<string | null>(
    pesananTerbaru?.id ?? null
  );

  const selected =
    riwayat.find((r) => r.id === selectedId) || pesananTerbaru || null;

  const displayTotal = selected ? selected.total : 0;
  const fallbackItems = [
    { produk_id: 1, nama_produk: "Belum ada pesanan", harga: 0, jumlah: 1 },
  ] as any;
  const displayItems: any[] = selected
    ? selected.items.length > 0
      ? selected.items
      : fallbackItems
    : riwayat.length === 0
    ? fallbackItems
    : fallbackItems;

  const handlePesanLagiGlobal = () => {
    if (selected) {
      pesanLagi(selected.id);
    } else if (typeof window !== "undefined") {
      window.location.href = "/menu";
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-10">
      <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-6">
        {/* ================= NAVBAR ================= */}
        <nav className="h-20 flex items-center justify-between bg-white rounded-2xl sm:rounded-[28px] px-4 sm:px-8 shadow-sm">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Warung WOW"
              width={100}
              height={76}
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-semibold text-black hover:text-[#2F54EB] flex items-center gap-1.5">
              <Home size={16} />
              Beranda
            </Link>
            <Link href="/menu" className="font-semibold text-black hover:text-[#2F54EB] flex items-center gap-1.5">
              <BookOpen size={16} />
              Menu
            </Link>
            <Link href="/keranjang" className="font-semibold text-black hover:text-[#2F54EB] flex items-center gap-1.5">
              <ShoppingCart size={16} />
              Keranjang
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/keranjang"
              className="relative w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition hidden sm:flex"
            >
              <ShoppingCart size={18} className="text-black" />
            </Link>
            <div className="bg-[#2F54EB] rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Table size={15} className="text-white" />
              <span className="text-white font-semibold text-xs sm:text-sm">{nomorMeja}</span>
            </div>
          </div>
        </nav>

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-5 mb-4 px-2">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#2F54EB] flex items-center justify-center">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
                Status Pesanan
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <History size={13} />
                {riwayat.length > 0
                  ? `Ada ${riwayat.length} riwayat pesanan`
                  : "Belum ada riwayat pesanan"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-black font-semibold shadow-sm hover:bg-gray-50 transition text-xs sm:text-sm"
            >
              <Plus size={15} />
              Tambah Menu
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          {/* LEFT: Riwayat list (sidebar) */}
          <aside className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-2 order-2 lg:order-1">
            {riwayat.length === 0 ? (
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <History size={26} className="text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">
                  Belum Ada Riwayat
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  Buat pesanan pertama Anda di menu.
                </p>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F54EB] text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition"
                >
                  <Plus size={14} />
                  Lihat Menu
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 space-y-2 max-h-[640px] overflow-y-auto">
                <p className="px-1 pt-1 pb-1 text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                  Riwayat Pesanan
                </p>
                {riwayat.map((r: RiwayatPesanan) => {
                  const aktif = selectedId === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={`w-full text-left rounded-xl border p-3 transition ${
                        aktif
                          ? "border-[#2F54EB] bg-blue-50/60 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-black">
                            #{r.id}
                          </p>
                          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                            {new Date(r.dibuatPada).toLocaleDateString("id-ID")} •{" "}
                            {new Date(r.dibuatPada).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            • {r.nomorMeja}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold ${
                            statusStyle[r.status] ||
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                          {r.items.length} item •{" "}
                          {r.items.slice(0, 2).map((i) => i.nama_produk).join(", ")}
                          {r.items.length > 2 ? ", ..." : ""}
                        </p>
                        <p className="font-bold text-[#2F54EB] text-xs sm:text-sm shrink-0">
                          Rp {Number(r.total).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            pesanLagi(r.id);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2F54EB] text-white font-semibold text-[11px] hover:bg-blue-700 transition"
                        >
                          <Plus size={12} />
                          Pesan Lagi
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            hapusRiwayat(r.id);
                            if (selectedId === r.id) setSelectedId(null);
                          }}
                          className="w-7 h-7 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
                          aria-label="Hapus riwayat"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* RIGHT: detail pesanan + status */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-3 sm:space-y-4 order-1 lg:order-2">
            {selected ? (
              <>
                {/* Card Header: Order info + actions */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-black text-sm sm:text-base flex items-center gap-2">
                        Order #{selected.id}
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold ${
                            statusStyle[selected.status] ||
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {selected.status}
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        {new Date(selected.dibuatPada).toLocaleString("id-ID")} •{" "}
                        <span className="font-semibold">{selected.nomorMeja}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => pesanLagi(selected.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2F54EB] text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition"
                    >
                      <Plus size={14} />
                      Pesan Lagi
                    </button>
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-black font-semibold text-xs sm:text-sm hover:bg-gray-50 transition"
                    >
                      Tambah Menu
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Detail Pembayaran Berhasil */}
                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  <div className="col-span-7">
                    <DetailPesanan
                      items={selected.items.length > 0 ? (selected.items as any) : fallbackItems}
                      totalHarga={displayTotal}
                    />
                  </div>
                  <div className="col-span-5">
                    <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 h-full shadow-sm bg-white flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="w-[22px] h-[22px] rounded-full bg-green-500 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm sm:text-base font-bold text-green-600">
                            Pembayaran Berhasil!
                          </h3>
                          <p className="text-xs text-gray-500">
                            Pesanan sedang diproses dapur
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handlePesanLagiGlobal}
                        className="w-full mt-3 h-11 rounded-xl bg-[#2F54EB] text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition"
                      >
                        Pesan Lagi / Kembali ke Beranda
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  <div className="col-span-7">
                    <TimelinePesanan />
                  </div>
                  <div className="col-span-5">
                    <KitchenStatus />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  <div className="col-span-7">
                    <DetailPesanan items={displayItems} totalHarga={displayTotal} />
                  </div>
                  <div className="col-span-5">
                    <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 h-full shadow-sm bg-white flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <ShoppingCart size={26} className="text-gray-400" />
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">
                        Pilih Pesanan
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-4">
                        Pilih riwayat di panel kiri untuk melihat detail.
                      </p>
                      <Link
                        href="/menu"
                        className="w-full h-11 rounded-xl bg-[#2F54EB] text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
                      >
                        <Plus size={15} />
                        Buat Pesanan Baru
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-3 sm:gap-4">
                  <div className="col-span-7">
                    <TimelinePesanan />
                  </div>
                  <div className="col-span-5">
                    <KitchenStatus />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
