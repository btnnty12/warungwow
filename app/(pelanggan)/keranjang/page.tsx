"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShieldCheck,
  ShoppingCart,
  Plus,
  RotateCcw,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useKeranjang } from "@/lib/useKeranjang";
import { useMeja } from "@/lib/useMeja";
import { supabase } from "@/lib/supabase";
import KeranjangNavbar from "../komponen/KeranjangNavbar";

export default function KeranjangPage() {
  const router = useRouter();
  const {
    keranjang,
    totalHarga,
    tambahKeKeranjang,
    kurangiJumlah,
    hapusDariKeranjang,
    kosongkanKeranjang,
  } = useKeranjang();
  const { nomorMeja } = useMeja();

  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [noHp, setNoHp] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);

  const displayItems = keranjang;

  const pajak = totalHarga * 0.1;
  const biayaLayanan = 3000;
  const totalPembayaran = totalHarga + pajak + biayaLayanan;

  const handlePesanSekarang = async () => {
    if (keranjang.length === 0) return;

    if (!namaPelanggan.trim()) {
      alert("Nama pelanggan wajib diisi.");
      return;
    }

    if (!noHp.trim()) {
      alert("Nomor HP wajib diisi.");
      return;
    }

    setLoadingOrder(true);

    try {
      const kodePesanan = `WOW-${Date.now().toString().slice(-8)}`;
      const waktuSekarang = new Date().toISOString();

      const { data: authData } = await supabase.auth.getSession();

      console.log("SESSION:", authData.session);

      const { data: pesananBaru, error: errorPesanan } = await supabase
        .from("pesanan")
        .insert([
          {
            kode_pesanan: kodePesanan,
            meja_id: null,
            nama_pelanggan: namaPelanggan.trim(),
            no_hp: noHp.trim(),
            total_harga: Number(totalPembayaran.toFixed(0)),
            metode_pembayaran: "QRIS",
            status_pembayaran: "menunggu",
            status_pesanan: "diterima_dapur",
            catatan: catatan.trim() || null,
            dibuat_pada: waktuSekarang,
            diperbarui_pada: waktuSekarang,
          },
        ])
        .select("id")
        .single();

      if (errorPesanan || !pesananBaru) {
        throw errorPesanan || new Error("Gagal membuat pesanan.");
      }

      const itemsToInsert = keranjang.map((item) => ({
        pesanan_id: pesananBaru.id,
        produk_id: item.produk_id,
        jumlah: item.jumlah,
        harga: Number(item.harga),
        subtotal: Number(item.harga) * item.jumlah,
      }));

      const { error: errorItem } = await supabase
        .from("detail_pesanan")
        .insert(itemsToInsert);

      if (errorItem) {
        throw errorItem;
      }

      kosongkanKeranjang();
      router.push(`/pembayaran?kode_pesanan=${encodeURIComponent(kodePesanan)}`);
    } catch (error: any) {
      console.error("handlePesanSekarang error:", error);
      alert(error?.message || "Gagal membuat pesanan. Coba ulangi.");
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8]">
      {/* ================= NAVBAR ================= */}
      <nav className="w-full border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto h-20 flex items-center justify-between px-4 sm:px-0">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Warung WOW"
                width={90}
                height={68}
                priority
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2F54EB]">
              Keranjang
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="font-semibold text-black hover:text-[#2F54EB]">
              Beranda
            </Link>
            <Link href="/menu" className="font-semibold text-black hover:text-[#2F54EB]">
              Menu
            </Link>
            <Link
              href="/status-pesanan"
              className="font-semibold text-black hover:text-[#2F54EB] flex items-center gap-1.5"
            >
              <FileText size={18} />
              Riwayat
            </Link>
          </div>

          <KeranjangNavbar />
        </div>
      </nav>

      {/* ================= ISI ================= */}
      <section className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 mt-6 px-3 sm:px-4 pb-10">
        {/* ================= LIST PRODUK ================= */}
        <div className="w-full lg:w-[65%]">
          {/* Action bar: Tambah Menu + Riwayat */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F54EB] text-white font-semibold shadow hover:bg-blue-700 transition text-sm"
            >
              <Plus size={18} />
              Tambah Menu
            </Link>
            <Link
              href="/status-pesanan"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-black font-semibold shadow-sm hover:bg-gray-50 transition text-sm"
            >
              <RotateCcw size={16} />
              Lihat Riwayat Pesanan
            </Link>
          </div>

          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <ShoppingCart size={72} className="text-gray-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                Keranjang Anda kosong
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Tambahkan menu lewat tombol di bawah
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F54EB] text-white font-semibold hover:bg-blue-700 transition text-sm"
              >
                <Plus size={18} />
                Lihat Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {displayItems.map((item) => {
                const harga =
                  typeof item.harga === "number"
                    ? item.harga
                    : Number(item.harga) || 0;
                const subtotal = harga * item.jumlah;

                return (
                  <div
                    key={item.produk_id}
                    className="w-full mx-auto bg-[#FF9500] rounded-2xl px-4 py-3 shadow-md flex gap-4 items-center"
                  >
                    {/* Gambar */}
                    <div className="bg-white rounded-xl p-2 flex-shrink-0">
                      {item.gambar ? (
                        <Image
                          src={item.gambar}
                          alt={item.nama_produk}
                          width={72}
                          height={72}
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-[72px] h-[72px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <ShoppingCart size={28} />
                        </div>
                      )}
                    </div>

                    {/* Informasi + Harga + Qty sejajar */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-bold text-black truncate">
                          {item.nama_produk}
                        </h2>
                        <div className="flex items-center justify-between sm:justify-start sm:gap-4 mt-1.5">
                          <p className="text-white text-base sm:text-lg font-bold">
                            Rp {harga.toLocaleString("id-ID")}
                          </p>
                          {/* + / - sejajar harga */}
                          <div className="flex items-center gap-2 sm:gap-3 bg-white border border-[#2F54EB] rounded-lg px-2.5 py-1">
                            <button
                              onClick={() => kurangiJumlah(item.produk_id)}
                              aria-label="Kurangi jumlah"
                              className="w-6 h-6 flex items-center justify-center rounded-md text-[#2F54EB] text-lg font-bold hover:bg-blue-50 transition"
                            >
                              −
                            </button>
                            <span className="text-black text-sm sm:text-base font-bold min-w-[20px] text-center">
                              {item.jumlah}
                            </span>
                            <button
                              onClick={() =>
                                tambahKeKeranjang({
                                  produk_id: item.produk_id,
                                  nama_produk: item.nama_produk,
                                  harga,
                                  gambar: item.gambar,
                                  jumlah: 1,
                                })
                              }
                              aria-label="Tambah jumlah"
                              className="w-6 h-6 flex items-center justify-center rounded-md bg-[#2F54EB] text-white text-lg font-bold hover:bg-blue-700 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Total + Hapus */}
                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-end gap-2 sm:gap-1">
                        <button
                          onClick={() => hapusDariKeranjang(item.produk_id)}
                          aria-label="Hapus item"
                          className="shrink-0 hover:scale-110 transition"
                        >
                          <Trash2 size={18} strokeWidth={2.5} className="text-white" />
                        </button>
                        <p className="text-lg sm:text-xl font-bold text-black">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= RINGKASAN ================= */}
        <div className="w-full lg:w-[35%]">
          <div className="flex lg:justify-end mb-3">
            <div className="bg-[#2F54EB] text-white px-4 py-2 rounded-full font-semibold shadow-md flex items-center gap-2 w-full lg:w-fit justify-center">
              <ShoppingCart size={20} />
              <span>{nomorMeja}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
            <h2 className="text-2xl font-bold mb-5 text-black">
              Ringkasan Pesanan
            </h2>

            <div className="flex justify-between mb-3 text-black text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">
                Rp {totalHarga.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between mb-3 text-black text-sm">
              <span>Pajak (10%)</span>
              <span className="font-semibold">
                Rp {pajak.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between mb-5 text-black text-sm">
              <span>Biaya Layanan</span>
              <span className="font-semibold">
                Rp {biayaLayanan.toLocaleString("id-ID")}
              </span>
            </div>

            <hr />

            <div className="mt-5 space-y-3">
              <div>
                <label
                  htmlFor="namaPelanggan"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Nama Pelanggan
                </label>
                <input
                  id="namaPelanggan"
                  value={namaPelanggan}
                  onChange={(e) => setNamaPelanggan(e.target.value)}
                  placeholder="Masukkan nama pelanggan"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F54EB] focus:border-[#2F54EB]"
                />
              </div>

              <div>
                <label
                  htmlFor="noHp"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  No HP
                </label>
                <input
                  id="noHp"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="Masukkan nomor HP"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F54EB] focus:border-[#2F54EB]"
                />
              </div>

              <div>
                <label
                  htmlFor="catatan"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Catatan
                </label>
                <textarea
                  id="catatan"
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tambahkan catatan untuk pesanan Anda..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F54EB] focus:border-[#2F54EB]"
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-black">
                Total Pembayaran
              </h3>
              <p className="text-2xl sm:text-3xl text-[#2F54EB] font-bold mt-1">
                Rp {totalPembayaran.toLocaleString("id-ID")}
              </p>
            </div>

            <button
              onClick={handlePesanSekarang}
              disabled={displayItems.length === 0 || loadingOrder}
              className={`w-full mt-5 py-3.5 rounded-xl font-bold text-base transition ${
                displayItems.length === 0 || loadingOrder
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#2F54EB] text-white hover:bg-blue-700"
              }`}
            >
              {loadingOrder ? "Memproses Pesanan..." : "Pesan Sekarang"}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              <ShieldCheck size={16} strokeWidth={2} style={{ color: "#22C55E" }} />
              <span className="text-xs sm:text-sm font-medium text-black">
                Transaksi aman & terpercaya
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
