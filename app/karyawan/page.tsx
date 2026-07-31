"use client";

import { useState } from "react";
import {
  ChefHat,
  Bell,
  Timer,
  Check,
  Clock,
  Flame,
} from "lucide-react";

type StatusMasak = "Menunggu" | "Memasak" | "Siap Diantar";

type PesananDapur = {
  id: string;
  noPesanan: string;
  meja: string;
  items: Array<{ nama: string; qty: number; catatan?: string }>;
  waktuMasuk: string;
  status: StatusMasak;
  prioritas: "biasa" | "tinggi";
};

const URUTAN: StatusMasak[] = ["Menunggu", "Memasak", "Siap Diantar"];

const AWAL: PesananDapur[] = [
  {
    id: "d1",
    noPesanan: "wow21120",
    meja: "C11",
    waktuMasuk: "10:12",
    prioritas: "biasa",
    status: "Menunggu",
    items: [
      { nama: "Nasi Goreng Spesial", qty: 1 },
      { nama: "Tempe Goreng", qty: 1, catatan: "Goreng kering" },
    ],
  },
  {
    id: "d2",
    noPesanan: "wow21122",
    meja: "A02",
    waktuMasuk: "10:15",
    prioritas: "tinggi",
    status: "Memasak",
    items: [
      { nama: "Ayam Geprek", qty: 1, catatan: "Level 2 pedas" },
      { nama: "Nasi Putih", qty: 1 },
      { nama: "Es Jeruk", qty: 1 },
    ],
  },
  {
    id: "d3",
    noPesanan: "wow21131",
    meja: "A03",
    waktuMasuk: "10:18",
    prioritas: "biasa",
    status: "Menunggu",
    items: [
      { nama: "Soto Ayam", qty: 2, catatan: "Kecap banyak" },
      { nama: "Kerupuk", qty: 2 },
      { nama: "Tahu Goreng", qty: 2 },
    ],
  },
  {
    id: "d4",
    noPesanan: "wow21133",
    meja: "Takeaway",
    waktuMasuk: "10:21",
    prioritas: "biasa",
    status: "Siap Diantar",
    items: [
      { nama: "Bakso Urat Besar", qty: 1 },
      { nama: "Mie Ayam", qty: 1 },
    ],
  },
];

const BADGE: Record<StatusMasak, string> = {
  Menunggu: "bg-gray-100 text-gray-700 border border-gray-200",
  Memasak: "bg-orange-50 text-orange-700 border border-orange-200",
  "Siap Diantar": "bg-green-50 text-green-700 border border-green-200",
};

function hitungMenit(waktu: string) {
  const [h, m] = "10:12".split(":").map(Number);
  const [h2, m2] = waktu.split(":").map(Number);
  return Math.max(1, (h2 - h) * 60 + (m2 - m));
}

export default function KaryawanAntrianPage() {
  const [data, setData] = useState<PesananDapur[]>(AWAL);

  const lanjut = (id: string) => {
    setData((arr) =>
      arr.map((p) => {
        if (p.id !== id) return p;
        const idx = URUTAN.indexOf(p.status);
        const next = URUTAN[Math.min(idx + 1, URUTAN.length - 1)];
        return { ...p, status: next };
      })
    );
  };

  const perStatus = (s: StatusMasak) => data.filter((p) => p.status === s);

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ChefHat className="text-[#558B2F]" size={28} />
              Antrian Masak
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Lihat dan perbarui status masakan secara real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-700 font-bold flex items-center gap-1">
              <Flame size={14} /> {perStatus("Memasak").length} memasak
            </div>
            <button className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition relative">
              <Bell size={16} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {data.filter((d) => d.status === "Menunggu").length}
              </span>
            </button>
          </div>
        </div>

        {/* Ringkasan Stat */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {URUTAN.map((s) => {
            const list = perStatus(s);
            const warna =
              s === "Menunggu"
                ? "from-gray-50 to-gray-100 text-gray-700 border-gray-200"
                : s === "Memasak"
                ? "from-orange-50 to-orange-100 text-orange-700 border-orange-200"
                : "from-green-50 to-green-100 text-green-700 border-green-200";
            return (
              <div
                key={s}
                className={`bg-gradient-to-b ${warna} rounded-xl p-3 sm:p-4 border shadow-sm`}
              >
                <p className="text-[10px] sm:text-xs font-bold opacity-75 mb-1">
                  {s}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold">
                  {list.length}
                </p>
                <p className="text-[10px] sm:text-xs opacity-65 mt-0.5">
                  {list.reduce((t, x) => t + x.items.reduce((a, b) => a + b.qty, 0), 0)} porsi
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban 3 kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
        {URUTAN.map((s) => (
          <div
            key={s}
            className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-extrabold text-gray-800 text-sm sm:text-base flex items-center gap-1.5">
                {s === "Menunggu" ? (
                  <Clock size={16} className="text-gray-500" />
                ) : s === "Memasak" ? (
                  <Flame size={16} className="text-orange-500" />
                ) : (
                  <Check size={16} className="text-green-600" />
                )}
                {s}
                <span className="ml-1 text-gray-400 font-normal text-xs">
                  ({perStatus(s).length})
                </span>
              </h2>
            </div>
            <div className="space-y-3">
              {perStatus(s).map((p) => {
                const durasi = hitungMenit(p.waktuMasuk);
                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border shadow-sm p-3 transition ${
                      p.prioritas === "tinggi"
                        ? "border-red-200 bg-red-50/40"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {/* Header card */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-extrabold text-gray-800 text-sm">
                          #{p.noPesanan}
                        </p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Timer size={11} /> {p.waktuMasuk} • {durasi}m lalu
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            p.prioritas === "tinggi"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {p.prioritas === "tinggi" ? "PRIORITAS" : "Meja " + p.meja}
                        </span>
                        {p.prioritas !== "tinggi" && (
                          <span className="text-[10px] text-gray-400">
                            Meja {p.meja}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <ul className="space-y-1 mb-3">
                      {p.items.map((it, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-xs sm:text-sm py-0.5 border-b border-gray-50 last:border-b-0"
                        >
                          <span className="w-6 h-5 flex-shrink-0 bg-[#558B2F]/10 text-[#558B2F] rounded-md inline-flex items-center justify-center text-[11px] font-bold">
                            x{it.qty}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-700 truncate">
                              {it.nama}
                            </p>
                            {it.catatan && (
                              <p className="text-[10px] text-orange-700 mt-0.5">
                                • {it.catatan}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Status + Action */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${BADGE[s]}`}
                      >
                        {s}
                      </span>
                      {s !== "Siap Diantar" ? (
                        <button
                          onClick={() => lanjut(p.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#558B2F] text-white text-xs font-bold rounded-lg hover:bg-[#497825] transition shadow-sm"
                        >
                          {s === "Menunggu" ? (
                            <Flame size={13} />
                          ) : (
                            <Check size={13} />
                          )}
                          {s === "Menunggu" ? "Mulai Masak" : "Siap Saji"}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setData((arr) => arr.filter((x) => x.id !== p.id))
                          }
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition shadow-sm"
                        >
                          <Check size={13} />
                          Diantar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {perStatus(s).length === 0 && (
                <div className="py-8 text-center text-gray-400 text-xs sm:text-sm border-2 border-dashed border-gray-200 rounded-xl">
                  Tidak ada {s.toLowerCase()}.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
