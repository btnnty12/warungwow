"use client";

import { useState, useMemo } from "react";
import { Calendar, Bell, Search, Eye, ChevronRight, ClipboardList } from "lucide-react";

type StatusPesanan = "Diterima" | "Dibuat" | "Diantar" | "Selesai" | "Dibatalkan";

type RowPesanan = {
  no: string;
  meja: string;
  waktu: string;
  items: number;
  total: number;
  status: StatusPesanan;
};

const DATA_PESANAN: RowPesanan[] = [
  { no: "wow21120", meja: "Meja C11", waktu: "22 Juli 2026, 10:12", items: 3, total: 30000, status: "Diterima" },
  { no: "wow21121", meja: "Meja C11", waktu: "22 Juli 2026, 10:12", items: 3, total: 30000, status: "Diantar" },
  { no: "wow21122", meja: "Meja C11", waktu: "22 Juli 2026, 10:12", items: 3, total: 30000, status: "Dibuat" },
  { no: "wow21125", meja: "Meja C11", waktu: "22 Juli 2026, 10:12", items: 3, total: 30000, status: "Selesai" },
  { no: "wow21128", meja: "Meja C11", waktu: "22 Juli 2026, 10:12", items: 3, total: 30000, status: "Dibatalkan" },
  { no: "wow21131", meja: "Meja A03", waktu: "22 Juli 2026, 10:18", items: 5, total: 125000, status: "Diterima" },
  { no: "wow21133", meja: "Takeaway", waktu: "22 Juli 2026, 10:21", items: 2, total: 48000, status: "Dibuat" },
  { no: "wow21140", meja: "Meja B07", waktu: "22 Juli 2026, 10:32", items: 4, total: 95000, status: "Selesai" },
  { no: "wow21145", meja: "Meja A05", waktu: "22 Juli 2026, 10:41", items: 6, total: 180000, status: "Diantar" },
];

const TABS: Array<{ key: "semua" | StatusPesanan; label: string }> = [
  { key: "semua", label: "Semua" },
  { key: "Diterima", label: "Diterima" },
  { key: "Dibuat", label: "Dibuat" },
  { key: "Diantar", label: "Diantar" },
  { key: "Selesai", label: "Selesai" },
  { key: "Dibatalkan", label: "Dibatalkan" },
];

const BADGE: Record<StatusPesanan, string> = {
  Diterima: "bg-blue-50 text-blue-700 border border-blue-200",
  Dibuat: "bg-purple-50 text-purple-700 border border-purple-200",
  Diantar: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Selesai: "bg-green-50 text-green-700 border border-green-200",
  Dibatalkan: "bg-red-50 text-red-700 border border-red-200",
};

export default function ManagerPesananPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("semua");
  const [cari, setCari] = useState("");
  const [lihat, setLihat] = useState<RowPesanan | null>(null);

  const terfilter = useMemo(() => {
    return DATA_PESANAN.filter((r) => {
      const matchTab = tab === "semua" ? true : r.status === tab;
      const q = cari.trim().toLowerCase();
      const matchCari =
        !q ||
        r.no.toLowerCase().includes(q) ||
        r.meja.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q);
      return matchTab && matchCari;
    });
  }, [tab, cari]);

  const ringkasan = useMemo(() => {
    const h = (s: StatusPesanan) => DATA_PESANAN.filter((r) => r.status === s).length;
    return {
      semua: DATA_PESANAN.length,
      Diterima: h("Diterima"),
      Dibuat: h("Dibuat"),
      Diantar: h("Diantar"),
      Selesai: h("Selesai"),
      Dibatalkan: h("Dibatalkan"),
    };
  }, []);

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList className="text-[#558B2F]" size={26} />
              Pesanan
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Kelola Pesanan masuk dari pelanggan
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar size={14} className="text-gray-600" />
              <span className="text-gray-700 font-medium text-sm">22 Juli 2026</span>
            </div>
            <button className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
              <Bell size={16} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
          <div className="flex overflow-x-auto gap-1 sm:gap-2 pb-1 -mx-1 px-1 lg:pb-0 lg:mx-0 lg:px-0 flex-wrap">
            {TABS.map((t) => {
              const aktif = t.key === tab;
              const count =
                t.key === "semua"
                  ? ringkasan.semua
                  : ringkasan[t.key as StatusPesanan];
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-bold whitespace-nowrap transition ${
                    aktif
                      ? "text-[#558B2F] border-b-2 border-[#558B2F] bg-green-50/60"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                  <span className="ml-1.5 text-[10px] sm:text-xs text-gray-400 font-normal">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex-1 lg:max-w-sm lg:ml-auto">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari pesanan..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F]/40 text-sm transition"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-white">
                <tr className="border-b border-gray-200">
                  {["No. Pesanan", "Meja", "Waktu", "Item", "Total", "Status", "Detail"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-3 sm:px-4 text-gray-600 font-bold text-xs sm:text-sm"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {terfilter.map((r) => (
                  <tr
                    key={r.no}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-3 sm:px-4 font-semibold text-gray-800 text-xs sm:text-sm">
                      {r.no}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm">
                      {r.meja}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
                      {r.waktu}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm">
                      {r.items} Item
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-bold text-gray-800 text-xs sm:text-sm">
                      Rp {r.total.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${BADGE[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <button
                        onClick={() => setLihat(r)}
                        className="inline-flex items-center gap-1.5 text-[#558B2F] hover:text-[#3e6b22] font-bold text-xs sm:text-sm transition"
                      >
                        <Eye size={15} />
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
                {terfilter.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-gray-400 text-sm"
                    >
                      Tidak ada pesanan untuk tab ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 bg-white py-3 px-4 text-center">
            <button className="inline-flex items-center gap-1.5 text-[#558B2F] font-bold text-sm hover:underline">
              Lihat Semua Pesanan
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {lihat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setLihat(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#558B2F] px-5 py-4 flex items-center justify-between">
              <div className="text-white">
                <p className="text-xs opacity-90">No. Pesanan</p>
                <p className="text-lg font-extrabold">{lihat.no}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${BADGE[lihat.status]}`}
              >
                {lihat.status}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Meja</p>
                  <p className="font-bold text-gray-800">{lihat.meja}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Waktu</p>
                  <p className="font-bold text-gray-800">{lihat.waktu}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Jumlah Item</p>
                  <p className="font-bold text-gray-800">{lihat.items} pcs</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Total</p>
                  <p className="font-extrabold text-[#558B2F]">
                    Rp {lihat.total.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-bold text-gray-500 mb-2">Daftar Item (contoh)</p>
                <div className="space-y-1.5 text-sm">
                  {[1, 2, 3].slice(0, lihat.items > 3 ? 3 : lihat.items).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-700">
                        {["Nasi Goreng Spesial", "Es Teh Manis", "Ayam Geprek"][i]} x1
                      </span>
                      <span className="font-semibold text-gray-800">
                        Rp {(lihat.total / lihat.items).toLocaleString("id-ID", {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setLihat(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-sm"
                >
                  Tutup
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-[#558B2F] text-white font-bold hover:bg-[#497825] transition text-sm shadow">
                  Cetak Struk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
