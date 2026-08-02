"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useKeranjang } from "@/lib/useKeranjang";
import { useMeja } from "@/lib/useMeja";
import { supabase } from "@/lib/supabase";
import type { ItemKeranjang } from "@/lib/types";
import DetailPesanan from "../komponen/DetailPesanan";
import QrisPayment from "../komponen/QrisPayment";
import TimelinePesanan from "../komponen/TimelinePesanan";

type StatusPesanan =
  | "diterima_dapur"
  | "sedang_dibuat"
  | "sedang_diantar"
  | "selesai"
  | "dibatalkan";

type InvoiceRow = {
  id: number;
  kode_pesanan: string;
  nama_pelanggan: string | null;
  no_hp: string | null;
  total_harga: number | null;
  catatan: string | null;
  dibuat_pada: string | null;
  status_pesanan: StatusPesanan;
};

export default function PembayaranPage() {
  const searchParams = useSearchParams();
  const { keranjang } = useKeranjang();
  const { nomorMeja } = useMeja();
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);
  const [items, setItems] = useState<ItemKeranjang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const kodePesanan = searchParams.get("kode_pesanan");

    if (!kodePesanan) {
      setError("Invoice tidak valid. Kembali ke keranjang dan buat pesanan baru.");
      setLoading(false);
      return;
    }

    async function loadInvoice() {
      try {
        setLoading(true);
        setError(null);

        const { data: pesananRow, error: pesananError } = await supabase
          .from("pesanan")
          .select(
            "id, kode_pesanan, nama_pelanggan, no_hp, total_harga, catatan, dibuat_pada, status_pesanan"
          )
          .eq("kode_pesanan", kodePesanan)
          .maybeSingle();

        if (pesananError) throw pesananError;
        if (!pesananRow) {
          throw new Error("Invoice tidak ditemukan.");
        }

        const { data: itemRows, error: itemError } = await supabase
        .from("detail_pesanan")
        .select(`
          id,
          produk_id,
          jumlah,
          harga,
          subtotal,
          produk (
            nama_produk,
            gambar
          )
        `)
        .eq("pesanan_id", pesananRow.id);

        if (itemError) throw itemError;

        setInvoice(pesananRow as InvoiceRow);
        setItems(
          (itemRows || []).map((row: any) => ({
            produk_id: row.produk_id,
            nama_produk: row.produk?.nama_produk || "Menu",
            harga: Number(row.harga || 0),
            gambar: row.produk?.gambar,
            jumlah: Number(row.jumlah || 1),
          }))
        );
      } catch (e: any) {
        console.error("loadInvoice error:", e);
        setError(e?.message || "Gagal memuat invoice.");
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [searchParams]);

  const displayTotal = invoice?.total_harga ?? 0;
  const displayItems = items.length > 0 ? items : keranjang;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="bg-white rounded-2xl px-8 py-6 shadow-lg text-center">
          <p className="font-semibold text-black">Memuat invoice...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="bg-white rounded-2xl px-8 py-6 shadow-lg text-center">
          <p className="font-semibold text-red-600">{error}</p>
          <Link
            href="/keranjang"
            className="mt-4 inline-flex rounded-xl bg-[#2F54EB] px-4 py-2 text-white font-semibold"
          >
            Kembali ke Keranjang
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <section className="max-w-7xl mx-auto bg-white rounded-[28px] px-10 pb-10 mt-8 shadow-xl">
        <nav className="h-24 flex items-center justify-between border-b border-gray-100">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Warung WOW"
              width={120}
              height={90}
              priority
            />
          </Link>

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

        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#2F54EB] flex items-center justify-center">
              <FileText size={32} className="text-white" />
            </div>
            <h1 className="text-[36px] font-extrabold text-black">
              Invoice & QRIS Payment
            </h1>
          </div>

          <div className="bg-[#2F54EB] rounded-full px-5 py-2 flex items-center gap-2">
            <Image
              src="/ikon meja putih.png"
              alt="Meja"
              width={24}
              height={24}
            />
            <span className="text-white font-semibold text-sm">{nomorMeja}</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-8">
          <div className="col-span-7">
            <DetailPesanan
              items={displayItems}
              totalHarga={displayTotal}
              orderCode={invoice?.kode_pesanan}
              orderDate={invoice?.dibuat_pada || undefined}
            />
          </div>
          <div className="col-span-5">
            <QrisPayment pesananId={invoice?.id} />
          </div>
        </div>

        <div className="mt-6">
          <TimelinePesanan status={invoice?.status_pesanan} />
        </div>
      </section>
    </main>
  );
}
