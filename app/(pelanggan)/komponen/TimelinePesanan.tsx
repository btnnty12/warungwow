"use client";

import type { StatusPesanan } from "@/lib/useRiwayatPesanan";

type Props = {
  status?: StatusPesanan;
};

const steps: {
  key: StatusPesanan;
  label: string;
  badge: string;
}[] = [
  {
    key: "diterima_dapur",
    label: "Diterima Dapur",
    badge: "Sedang Diproses",
  },
  {
    key: "sedang_dibuat",
    label: "Sedang Dibuat",
    badge: "Sedang Diproses",
  },
  {
    key: "sedang_diantar",
    label: "Sedang Diantar",
    badge: "Sedang Diantar",
  },
  {
    key: "selesai",
    label: "Selesai",
    badge: "Pesanan Selesai",
  },
];

export default function TimelinePesanan({
  status = "diterima_dapur",
}: Props) {
  const currentIndex = steps.findIndex((s) => s.key === status);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const progressWidth = `${(safeIndex / (steps.length - 1)) * 100}%`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-[#2F54EB] mb-8">
        Track Pesanan Anda
      </h2>

      <div className="relative">
        <div className="absolute top-[14px] left-5 right-5 h-[3px] bg-gray-200 rounded-full"></div>
        <div
          className="absolute top-[14px] left-5 h-[3px] bg-[#f97316] rounded-full transition-all duration-300"
          style={{ width: `calc(${progressWidth} - 0px)` }}
        ></div>

        <div className="relative z-10 grid grid-cols-4 gap-2 items-start">
          {steps.map((step, index) => {
            const active = index <= safeIndex;
            const current = index === safeIndex;

            return (
              <div
                key={step.key}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`relative w-8 h-8 rounded-full border-[4px] flex items-center justify-center transition-all duration-300 ${
                    active
                      ? "bg-[#f97316] border-[#fed7aa]"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      active ? "bg-white" : "bg-gray-300"
                    }`}
                  />
                </div>

                <p
                  className={`mt-3 text-xs sm:text-sm font-semibold ${
                    active ? "text-[#2F54EB]" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>

                {current && (
                  <span className="mt-2 rounded-full bg-orange-100 text-orange-600 px-3 py-1 text-[10px] sm:text-xs font-semibold">
                    {step.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}