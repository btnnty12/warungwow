"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ItemKeranjang } from "./types";

type KeranjangContextType = {
  keranjang: ItemKeranjang[];
  totalHarga: number;
  tambahKeKeranjang: (produk: ItemKeranjang) => void;
  kurangiJumlah: (produkId: number) => void;
  hapusDariKeranjang: (produkId: number) => void;
  kosongkanKeranjang: () => void;
};

const KeranjangContext = createContext<KeranjangContextType | undefined>(undefined);

export function KeranjangProvider({ children }: { children: ReactNode }) {
  const [keranjang, setKeranjang] = useState<ItemKeranjang[]>([]);

  // Ambil data dari localStorage saat komponen mount
  useEffect(() => {
    console.log("useKeranjang useEffect mount");
    const data = localStorage.getItem("keranjang");
    console.log("localStorage keranjang:", data);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log("parsed keranjang:", parsed);
        setKeranjang(parsed);
      } catch (error) {
        console.error("Error parsing keranjang:", error);
        setKeranjang([]);
        localStorage.removeItem("keranjang");
      }
    } else {
      console.log("No keranjang in localStorage, setting empty array");
      setKeranjang([]);
    }
  }, []);

  // Hitung total harga
  const totalHarga = keranjang.reduce((sum, item) => {
    const harga = typeof item.harga === "number" ? item.harga : Number(item.harga) || 0;
    return sum + harga * item.jumlah;
  }, 0);

  // Fungsi tambah ke keranjang
  function tambahKeKeranjang(produk: ItemKeranjang) {
    console.log("tambahKeKeranjang called with:", produk);
    
    setKeranjang((dataLama) => {
      const produkAda = dataLama.find((item) => item.produk_id === produk.produk_id);
      let dataBaru;

      if (produkAda) {
        console.log("Produk sudah ada, menambah jumlah");
        dataBaru = dataLama.map((item) =>
          item.produk_id === produk.produk_id
            ? { ...item, jumlah: item.jumlah + 1 }
            : item
        );
      } else {
        console.log("Produk baru, menambah ke keranjang");
        dataBaru = [...dataLama, produk];
      }

      console.log("dataBaru:", dataBaru);
      localStorage.setItem("keranjang", JSON.stringify(dataBaru));
      console.log("localStorage updated");
      return dataBaru;
    });
  }

  // Fungsi kurangi jumlah
  function kurangiJumlah(produkId: number) {
    console.log("kurangiJumlah called with id:", produkId);
    setKeranjang((dataLama) => {
      const produkIndex = dataLama.findIndex((item) => item.produk_id === produkId);

      if (produkIndex === -1) return dataLama;

      const produk = dataLama[produkIndex];
      let dataBaru;

      if (produk.jumlah <= 1) {
        // Hapus produk jika jumlah 1
        dataBaru = dataLama.filter((item) => item.produk_id !== produkId);
      } else {
        // Kurangi jumlah
        dataBaru = dataLama.map((item) =>
          item.produk_id === produkId ? { ...item, jumlah: item.jumlah - 1 } : item
        );
      }

      console.log("kurangiJumlah dataBaru:", dataBaru);
      localStorage.setItem("keranjang", JSON.stringify(dataBaru));
      return dataBaru;
    });
  }

  // Fungsi hapus produk
  function hapusDariKeranjang(produkId: number) {
    console.log("hapusDariKeranjang called with id:", produkId);
    setKeranjang((dataLama) => {
      const dataBaru = dataLama.filter((item) => item.produk_id !== produkId);
      localStorage.setItem("keranjang", JSON.stringify(dataBaru));
      return dataBaru;
    });
  }

  // Fungsi kosongkan keranjang
  function kosongkanKeranjang() {
    console.log("kosongkanKeranjang called");
    setKeranjang([]);
    localStorage.removeItem("keranjang");
  }

  return (
    <KeranjangContext.Provider
      value={{
        keranjang,
        totalHarga,
        tambahKeKeranjang,
        kurangiJumlah,
        hapusDariKeranjang,
        kosongkanKeranjang,
      }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const context = useContext(KeranjangContext);
  if (!context) {
    throw new Error("useKeranjang must be used within a KeranjangProvider");
  }
  return context;
}