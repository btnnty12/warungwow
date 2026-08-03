"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ItemKeranjang } from "./types";
import { supabase } from "./supabase";

export type StatusPesanan =
  | "diterima_dapur"
  | "sedang_dibuat"
  | "sedang_diantar"
  | "selesai"
  | "dibatalkan";

export type RiwayatPesanan = {
  id: string;
  nomorMeja: string;
  items: ItemKeranjang[];
  subtotal: number;
  pajak: number;
  biayaLayanan: number;
  total: number;
  status: StatusPesanan;
  dibuatPada: number;
};

type RiwayatContextType = {
  riwayat: RiwayatPesanan[];
  simpanRiwayat: (p: Omit<RiwayatPesanan, "id" | "dibuatPada">) => RiwayatPesanan;
  pesanLagi: (id: string) => void;
  hapusRiwayat: (id: string) => void;
  updateStatus: (id: string, status: StatusPesanan) => void;
  pesananTerbaru: RiwayatPesanan | null;
};

const RiwayatContext = createContext<RiwayatContextType | undefined>(undefined);
const STORAGE_KEY = "riwayat_pesanan";
const KERANJANG_KEY = "keranjang";

export function RiwayatPesananProvider({ children }: { children: ReactNode }) {
  const [riwayat, setRiwayat] = useState<RiwayatPesanan[]>([]);

    useEffect(() => {
      async function loadRiwayat() {
        const { data, error } = await supabase
          .from("pesanan")
          .select(`
            id,
            kode_pesanan,
            nama_pelanggan,
            total_harga,
            status_pesanan,
            dibuat_pada,
            meja (
              nomor_meja
            ),
            detail_pesanan (
              id,
              jumlah,
              harga,
              subtotal,
              produk (
                nama_produk,
                gambar
              )
            )
          `)
          .order("dibuat_pada", {
            ascending: false,
          });


        if (error) {
          console.error("Gagal mengambil riwayat:", error);
          return;
        }


        const formatted: RiwayatPesanan[] = data.map((p: any) => ({
          id: p.kode_pesanan,

          nomorMeja:
            p.meja?.nomor_meja ?? "-",

          items: p.detail_pesanan.map((item: any) => ({
            produk_id: item.id,
            nama_produk:
              item.produk?.nama_produk ?? "-",
            harga: Number(item.harga),
            jumlah: item.jumlah,
            gambar:
              item.produk?.gambar,
          })),

          subtotal: Number(p.total_harga),
          pajak: 0,
          biayaLayanan: 0,
          total: Number(p.total_harga),

          status: p.status_pesanan as StatusPesanan,

          dibuatPada:
            new Date(p.dibuat_pada).getTime(),
        }));

        setRiwayat(formatted);
      }


      loadRiwayat();

    }, []);

  const persist = (list: RiwayatPesanan[]) => {
    setRiwayat(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const simpanRiwayat: RiwayatContextType["simpanRiwayat"] = (p) => {
    const id = `WOW${Date.now().toString().slice(-8)}`;
    const baru: RiwayatPesanan = {
      ...p,
      id,
      dibuatPada: Date.now(),
    };
    persist([baru, ...riwayat].slice(0, 30));
    return baru;
  };

  const pesanLagi = (id: string) => {
    const target = riwayat.find((r) => r.id === id);
    if (!target || target.items.length === 0) return;
    const baruKeranjang: ItemKeranjang[] = target.items.map((i) => ({
      produk_id: i.produk_id,
      nama_produk: i.nama_produk,
      harga: typeof i.harga === "number" ? i.harga : Number(i.harga) || 0,
      gambar: i.gambar,
      jumlah: i.jumlah,
    }));
    localStorage.setItem(KERANJANG_KEY, JSON.stringify(baruKeranjang));
    if (typeof window !== "undefined") {
      window.location.href = "/keranjang";
    }
  };

  const hapusRiwayat = (id: string) => {
    persist(riwayat.filter((r) => r.id !== id));
  };

  const updateStatus = (id: string, status: StatusPesanan) => {
    persist(
      riwayat.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
            }
          : r
      )
    );
  };

  const pesananTerbaru = riwayat.length > 0 ? riwayat[0] : null;

  return (
    <RiwayatContext.Provider
      value={{
        riwayat,
        simpanRiwayat,
        pesanLagi,
        hapusRiwayat,
        updateStatus,
        pesananTerbaru,
      }}
    >
      {children}
    </RiwayatContext.Provider>
  );
}

export function useRiwayatPesanan() {
  const ctx = useContext(RiwayatContext);
  if (!ctx) {
    throw new Error("useRiwayatPesanan must be used within RiwayatPesananProvider");
  }
  return ctx;
}
