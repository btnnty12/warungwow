"use client";

import { CheckCircle, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";

type QrisPaymentProps = {
  onSudahBayar?: () => void;
};

export default function QrisPayment({ onSudahBayar }: QrisPaymentProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onSudahBayar) {
      onSudahBayar();
    } else {
      router.push("/status-pesanan");
    }
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
        className="w-full mt-6 h-12 rounded-xl bg-[#2F54EB] text-white font-bold text-base hover:bg-blue-700 transition"
      >
        Saya Sudah Bayar
      </button>

      {/* Catatan */}
      <p className="text-xs text-center text-gray-400 mt-3">
        Pembayaran akan diverifikasi secara otomatis
      </p>
    </div>
  );
}
