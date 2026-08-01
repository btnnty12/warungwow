"use client";

import { Truck, CheckCircle2, Circle } from "lucide-react";

type Status =
  | "diterima_dapur"
  | "sedang_dibuat"
  | "sedang_diantar"
  | "selesai"
  | "dibatalkan";

interface TimelinePesananProps {
  status?: Status;
}

const steps = [
  { id: "diterima_dapur", label: "Diterima Dapur" },
  { id: "sedang_dibuat", label: "Sedang Dibuat" },
  { id: "sedang_diantar", label: "Sedang Diantar" },
  { id: "selesai", label: "Selesai" },
] as const;

export default function TimelinePesanan({
  status = "diterima_dapur",
}: TimelinePesananProps) {
  if (status === "dibatalkan") {
    return (
      <div className="border border-red-200 rounded-2xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-red-600">Pesanan Dibatalkan</h2>
        <p className="text-gray-600 mt-2">Pesanan ini telah dibatalkan.</p>
      </div>
    );
  }

  const currentIndex = steps.findIndex((step) => step.id === status);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="border border-gray-200 rounded-2xl p-6 sm:p-7 bg-white shadow-sm">
      <h2 className="text-2xl font-bold text-[#2F54EB] flex items-center gap-2 mb-6">
        <Truck size={28} />
        Track Pesanan Anda
      </h2>

      <div className="relative max-w-4xl">
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200" />

        {steps.map((step, index) => {
          const selesai = index < safeIndex;
          const aktif = index === safeIndex;

          return (
            <div key={step.id} className="relative flex items-start gap-4 pb-5 last:pb-0">
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    selesai
                      ? "bg-green-500 text-white border-green-500"
                      : aktif
                        ? "bg-orange-100 text-orange-600 border-orange-300"
                        : "bg-gray-100 text-gray-400 border-gray-300"
                  }`}
                >
                  {selesai ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-10 mt-2 ${
                      selesai ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p
                    className={`font-semibold ${
                      selesai || aktif ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>

                  {aktif && (
                    <span className="inline-flex w-fit items-center rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold text-orange-700">
                      Sedang Diproses
                    </span>
                  )}

                  {selesai && (
                    <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">
                      Selesai
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}