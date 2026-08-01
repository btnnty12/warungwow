"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

type OperationalStatusProps = {
  completed: { jumlah: number; persentase: number };
  processing: { jumlah: number; persentase: number };
  cancelled: { jumlah: number; persentase: number };
};

export default function OperationalStatus({
  completed,
  processing,
  cancelled,
}: OperationalStatusProps) {
  const router = useRouter();
  const operationalData = [
    { label: "Completed", count: completed.jumlah, percentage: `${completed.persentase}%`, color: "#22c55e" },
    { label: "Processing", count: processing.jumlah, percentage: `${processing.persentase}%`, color: "#f97316" },
    { label: "Cancelled", count: cancelled.jumlah, percentage: `${cancelled.persentase}%`, color: "#ef4444" },
  ];

  const chartRadius = 38;
  const circumference = 2 * Math.PI * chartRadius;

  let offset = 0;

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h3 className="text-base sm:text-lg font-bold text-gray-800">
          Operational Status
        </h3>
        <span className="text-[11px] text-gray-500">
          Total {completed.jumlah + processing.jumlah + cancelled.jumlah} pesanan
        </span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto md:mx-0 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="12" />
            {operationalData.map((item, idx) => {
              const pct = Number(item.percentage.replace("%", "")) / 100;
              const dash = pct * circumference;
              const dashOffset = -offset;
              offset += dash;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={chartRadius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="12"
                  strokeDasharray={`${dash} ${circumference}`}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xl font-extrabold text-gray-800">
              {completed.jumlah + processing.jumlah + cancelled.jumlah}
            </p>
            <p className="text-[10px] text-gray-500">Total Orders</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {operationalData.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div
                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-bold text-gray-700 flex-1 text-sm">{item.label}</span>
              <span className="font-bold text-gray-800 text-xs sm:text-sm tabular-nums">
                {item.count} ({item.percentage})
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => router.push("/manager/pesanan")}
            className="w-full mt-3 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition text-sm inline-flex items-center justify-center gap-1.5"
          >
            View All Orders
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
