"use client";

import { Truck, CheckCircle2, Circle } from "lucide-react";
import { useState, useEffect } from "react";

type Status = "diterima" | "dibuat" | "diantar" | "selesai";

export default function TimelinePesanan() {
  const [status, setStatus] = useState<Status>("diterima");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    const t1 = setTimeout(() => setStatus("dibuat"), 3000);
    const t2 = setTimeout(() => setStatus("diantar"), 8000);
    const t3 = setTimeout(() => setStatus("selesai"), 13000);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const steps = [
    { id: "diterima" as const, label: "Diterima Dapur", icon: CheckCircle2 },
    { id: "dibuat" as const, label: "Sedang Dibuat", icon: Circle },
    { id: "diantar" as const, label: "Sedang Diantar", icon: Circle },
    { id: "selesai" as const, label: "Selesai", icon: CheckCircle2 },
  ];

  const getStepIndex = (s: Status) => steps.findIndex(step => step.id === s);
  const currentIndex = getStepIndex(status);

  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-[#2F54EB] flex items-center gap-2 mb-6">
        <Truck size={28} />
        Track Pesanan Anda
      </h2>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-gray-300" />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className="flex items-start gap-4 mb-8 last:mb-0"
            >
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                    isCompleted
                      ? "bg-green-500 text-white border-green-500"
                      : isActive
                      ? "bg-orange-100 text-orange-600 border-orange-300"
                      : "bg-gray-200 text-gray-500 border-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Circle size={16} />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 mt-2 transition-all ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p
                      className={`font-semibold ${
                        isCompleted || isActive ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </p>
                    {(isCompleted || isActive) && (
                      <p className="text-xs text-gray-500">
                        {new Date().toLocaleDateString("id-ID")} |{" "}
                        {new Date().toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full">
                      Sedang Diproses
                    </span>
                  )}
                  {isCompleted && (
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                      Selesai
                    </span>
                  )}
                  {!isActive && !isCompleted && (
                    <span className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                      Menunggu
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
