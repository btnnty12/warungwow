"use client";

import { CheckCircle, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type QrisPaymentProps = {
  pesananId?: number;
};

export default function QrisPayment({
  pesananId,
}: QrisPaymentProps) {
  const router = useRouter();

  const [loadingQr, setLoadingQr] = useState(true);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [qrUrl, setQrUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [expiredAt, setExpiredAt] = useState("");

  useEffect(() => {
    if (!pesananId) return;

    createPayment();
  }, [pesananId]);

  const createPayment = async () => {
    try {
      setLoadingQr(true);

      const response = await fetch("/api/midtrans/create-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pesanan_id: pesananId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setQrUrl(result.payment.qr_url);
      setPaymentStatus(result.payment.status);
      setExpiredAt(result.payment.expired_at);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQr(false);
    }
  };

  const handleClick = () => {
    router.push("/status-pesanan");
  };

  const handleCancel = () => {
    router.push("/status-pesanan");
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-6 h-full shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          <QrCode size={28} />
          QRIS Payment
        </h2>

        <span className="font-bold text-2xl">
          QRIS
        </span>
      </div>

      <p className="text-center text-gray-500 text-sm mb-6">
        Scan kode QR berikut untuk melakukan pembayaran
      </p>

      <div className="flex justify-center">
        <div className="w-48 h-48 bg-gray-50 rounded-2xl border-2 border-[#2F54EB] flex items-center justify-center p-2">

          <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center">

            {loadingQr ? (
              <span className="text-sm text-gray-500">
                Memuat QR...
              </span>
            ) : qrUrl ? (
              <img
                src={qrUrl}
                alt="QRIS"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-sm text-red-500 text-center">
                QR gagal dimuat
              </span>
            )}

          </div>

        </div>
      </div>

      <div className="text-center mt-4 text-xs text-gray-600 space-y-1">
        <p>Merchant Name</p>
        <p className="font-semibold">
          Warung WOW
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 bg-green-50 rounded-xl py-2 px-4">

        <CheckCircle
          size={24}
          className="text-green-600"
        />

        <div className="flex flex-col items-center">
          <span className="text-green-700 text-sm font-semibold">
            {paymentStatus}
          </span>

          <span className="text-green-600 text-xs">
            Berlaku sampai {expiredAt || "-"}
          </span>
        </div>

      </div>

      <button
        onClick={handleClick}
        disabled={loadingConfirm || loadingCancel}
        className="w-full mt-6 h-12 rounded-xl bg-[#2F54EB] text-white font-bold"
      >
        Saya Sudah Bayar
      </button>

      <button
        onClick={handleCancel}
        disabled={loadingConfirm || loadingCancel}
        className="w-full mt-3 h-11 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold"
      >
        Batalkan Pesanan
      </button>

      <p className="text-xs text-center text-gray-400 mt-3">
        Pembayaran akan diverifikasi otomatis
      </p>
    </div>
  );
}