"use client";

import { CheckCircle, QrCode } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type QrisPaymentProps = {
  onSudahBayar?: () => void;
  orderCode?: string;
};

export default function QrisPayment({ onSudahBayar, orderCode }: QrisPaymentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const handleClick = async () => {
    if (onSudahBayar) {
      onSudahBayar();
      return;
    }

    const code = orderCode || searchParams.get("kode_pesanan") || "";
    if (code) {
      try {
        setLoadingConfirm(true);
        const { error } = await supabase
          .from("pesanan")
          .update({
            status_pembayaran: "berhasil",
            diperbarui_pada: new Date().toISOString(),
          })
          .eq("kode_pesanan", code);

        if (error) throw error;
      } catch (e: any) {
        console.error("Konfirmasi pembayaran gagal:", e);
        alert(e?.message || "Gagal mengubah status pembayaran.");
        setLoadingConfirm(false);
        return;
      } finally {
        setLoadingConfirm(false);
      }
    }

    router.push("/status-pesanan");
  };

  const handleCancel = async () => {
    const code = orderCode || searchParams.get("kode_pesanan") || "";
    if (!code) {
      router.push("/keranjang");
      return;
    }

    try {
      setLoadingCancel(true);
      const { error } = await supabase
        .from("pesanan")
        .update({
          status_pembayaran: "gagal",
          status_pesanan: "dibatalkan",
          diperbarui_pada: new Date().toISOString(),
        })
        .eq("kode_pesanan", code);

      if (error) throw error;
    } catch (e: any) {
      console.error("Batalkan pesanan gagal:", e);
      alert(e?.message || "Gagal membatalkan pesanan.");
      setLoadingCancel(false);
      return;
    } finally {
      setLoadingCancel(false);
    }

    router.push("/status-pesanan");
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-6 h-full shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          <QrCode size={28} />
          QRIS Payment
        </h2>
        <span className="font-bold text-2xl">QRIS</span>
      </div>

      <p className="text-center text-gray-500 text-sm mb-6">
        Scan kode QR berikut untuk melakukan pembayaran
      </p>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="w-48 h-48 bg-gray-50 rounded-2xl border-2 border-[#2F54EB] flex items-center justify-center p-2">
          <div className="w-40 h-40 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center">
            <QrCode size={64} className="text-gray-800" />
            <span className="text-xs text-gray-500 mt-2">QRIS</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-gray-600 space-y-1">
        <p>Merchant Name</p>
        <p className="font-semibold">Warung WOW</p>
        <p>NIMD: 123456789012345678921</p>
        <p>TID</p>
      </div>

      {/* Status */}
      <div className="mt-6 flex items-center justify-center gap-2 bg-green-50 rounded-xl py-2 px-4">
        <CheckCircle size={24} className="text-green-600 font-bold" />
        <div className="flex flex-col items-center">
          <span className="text-green-700 text-sm font-semibold">Menunggu Pembayaran</span>
          <span className="text-green-600 text-xs">
            Selesaikan pembayaran dalam <strong>14:59</strong>
          </span>
        </div>
      </div>

      {/* Tombol */}
      <button
        onClick={handleClick}
        disabled={loadingConfirm || loadingCancel}
        className="w-full mt-6 h-12 rounded-xl bg-[#2F54EB] text-white font-bold text-base hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loadingConfirm ? "Memverifikasi Pembayaran..." : "Saya Sudah Bayar"}
      </button>

      <button
        onClick={handleCancel}
        disabled={loadingConfirm || loadingCancel}
        className="w-full mt-3 h-11 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {loadingCancel ? "Membatalkan Pesanan..." : "Batalkan Pesanan"}
      </button>

      {/* Catatan */}
      <p className="text-xs text-center text-gray-400 mt-3">
        Pembayaran akan diverifikasi secara otomatis
      </p>
    </div>
  );
}
