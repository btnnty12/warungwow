"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Bell,
  Search,
  Eye,
  ClipboardList,
  ChevronDown,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import {
  usePesananRealtime,
  URUTAN_STATUS,
  type Pesanan,
  type StatusUI,
} from "@/lib/use-pesanan-realtime";

const TABS: Array<{ key: "semua" | StatusUI; label: string }> = [
  { key: "semua", label: "Semua" },
  { key: "Diterima", label: "Diterima" },
  { key: "Dibuat", label: "Dibuat" },
  { key: "Diantar", label: "Diantar" },
  { key: "Selesai", label: "Selesai" },
  { key: "Dibatalkan", label: "Dibatalkan" },
];

const BADGE: Record<StatusUI, string> = {
  Diterima: "bg-blue-50 text-blue-700 border border-blue-200",
  Dibuat: "bg-purple-50 text-purple-700 border border-purple-200",
  Diantar: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Selesai: "bg-green-50 text-green-700 border border-green-200",
  Dibatalkan: "bg-red-50 text-red-700 border border-red-200",
};

export default function KaryawanPesananPage() {
  const {
    pesanan,
    loading,
    error,
    ringkasan,
    refresh,
    ubahStatus,
    nextStatus,
  } = usePesananRealtime();

  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("semua");
  const [cari, setCari] = useState("");
  const [lihat, setLihat] = useState<Pesanan | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const terfilter = useMemo(() => {
    return pesanan.filter((r) => {
      const matchTab = tab === "semua" ? true : r.status === tab;
      const q = cari.trim().toLowerCase();
      const matchCari =
        !q ||
        r.kode_pesanan.toLowerCase().includes(q) ||
        r.no_meja.toLowerCase().includes(q) ||
        (r.nama_pelanggan || "").toLowerCase().includes(q) ||
        (r.no_hp || "").toLowerCase().includes(q) ||
        r.items.some((i) => i.nama.toLowerCase().includes(q));
      return matchTab && matchCari;
    });
  }, [pesanan, tab, cari]);

  const updateStatus = async (id: number, s: StatusUI) => {
    setSubmittingId(id);
    await ubahStatus(id, s);
    setSubmittingId(null);
    setOpenMenuId(null);
    if (lihat && lihat.id === id) {
      setLihat((l) => (l ? { ...l, status: s } : l));
    }
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList className="text-[#558B2F]" size={26} />
              Pesanan
            </h1>
            <p className="text-gray-700 mt-1 text-sm sm:text-base">
              Kelola pesanan dan ubah status dengan cepat
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar size={14} className="text-gray-600" />
              <span className="text-gray-700 font-medium text-sm">
                {new Date().toLocaleDateString("id-ID", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </span>
            </div>
            <button
              onClick={refresh}
              title="Refresh data"
              className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
            >
              <RefreshCw size={16} className="text-gray-700" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
              <Bell size={16} className="text-gray-700" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold">Gagal memuat data pesanan</p>
              <p className="mt-0.5">{error}</p>
              <button
                onClick={refresh}
                className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
          <div className="flex overflow-x-auto gap-1 sm:gap-2 pb-1 -mx-1 px-1 lg:pb-0 lg:mx-0 lg:px-0 flex-wrap">
            {TABS.map((t) => {
              const aktif = t.key === tab;
              const count =
                t.key === "semua"
                  ? ringkasan.semua
                  : ringkasan[t.key as StatusUI];
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
                  <span className="ml-1.5 text-[10px] sm:text-xs text-gray-600 font-normal">
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
                placeholder="Cari pesanan, meja, atau menu..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F]/40 text-sm transition"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-white">
                <tr className="border-b border-gray-200">
                  {["No. Pesanan", "Meja", "Waktu", "Item", "Total", "Status", "Aksi"].map(
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <div className="inline-block w-6 h-6 border-2 border-[#558B2F]/30 border-t-[#558B2F] rounded-full animate-spin mb-2" />
                      <p className="text-gray-600 text-sm">Memuat pesanan...</p>
                    </td>
                  </tr>
                ) : terfilter.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-600 text-sm">
                      Tidak ada pesanan.
                    </td>
                  </tr>
                ) : (
                  terfilter.map((r) => {
                    const next = nextStatus(r.status);
                    const busy = submittingId === r.id;
                    return (
                      <tr
                        key={r.id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition relative"
                      >
                        <td className="py-3 px-3 sm:px-4 font-semibold text-gray-800 text-xs sm:text-sm">
                          {r.kode_pesanan}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm">
                          {r.no_meja}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
                          {new Date(r.dibuat_pada).toLocaleString("id-ID", {
                            day: "2-digit", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm">
                          <div className="max-w-[180px]">
                            <p className="font-bold text-gray-800">
                              {r.items.length} Item
                            </p>
                            <p className="text-gray-600 truncate">
                              {r.items.map((i) => i.nama).join(", ")}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-4 font-bold text-gray-800 text-xs sm:text-sm">
                          Rp {Number(r.total || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-3 sm:px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${BADGE[r.status]}`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setLihat(r)}
                              title="Lihat detail"
                              className="w-8 h-8 inline-flex items-center justify-center text-[#558B2F] border border-[#558B2F]/30 rounded-lg hover:bg-green-50 transition"
                            >
                              <Eye size={14} />
                            </button>
                            {next && (
                              <button
                                onClick={() => updateStatus(r.id, next)}
                                disabled={busy}
                                title={`Ubah ke ${next}`}
                                className="inline-flex items-center gap-1 px-2.5 h-8 bg-[#558B2F] text-white rounded-lg text-xs font-bold hover:bg-[#497825] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {busy ? (
                                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <Check size={13} />
                                )}
                                {next}
                              </button>
                            )}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenMenuId(openMenuId === r.id ? null : r.id)
                                }
                                className="w-8 h-8 inline-flex items-center justify-center text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                              >
                                <ChevronDown size={14} />
                              </button>
                              {openMenuId === r.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-20"
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  <div className="absolute right-0 top-full mt-1 z-30 bg-white shadow-xl border border-gray-200 rounded-xl py-1.5 w-40">
                                    {URUTAN_STATUS.map((s) => (
                                      <button
                                        key={s}
                                        disabled={s === r.status || submittingId === r.id}
                                        onClick={() => updateStatus(r.id, s)}
                                        className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm transition ${
                                          s === r.status
                                            ? "text-gray-400 bg-gray-50 font-bold"
                                            : "text-gray-700 hover:bg-green-50 hover:text-[#558B2F] font-semibold"
                                        }`}
                                      >
                                        {s === r.status && "✓ "}
                                        {s}
                                      </button>
                                    ))}
                                    <div className="my-1 border-t border-gray-100" />
                                    <button
                                      onClick={() => updateStatus(r.id, "Dibatalkan")}
                                      disabled={r.status === "Dibatalkan" || submittingId === r.id}
                                      className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm transition ${
                                        r.status === "Dibatalkan"
                                          ? "text-gray-400 bg-gray-50 font-bold"
                                          : "text-red-600 hover:bg-red-50 font-semibold"
                                      }`}
                                    >
                                      {r.status === "Dibatalkan" && "✓ "}
                                      Dibatalkan
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {lihat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setLihat(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-[#558B2F] px-5 py-4 flex items-center justify-between gap-3">
              <div className="text-white min-w-0">
                <p className="text-xs opacity-90">
                  No. Pesanan • {lihat.no_meja}
                </p>
                <p className="text-lg font-extrabold truncate">{lihat.kode_pesanan}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${BADGE[lihat.status]}`}
              >
                {lihat.status}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600 text-xs font-semibold">Pelanggan</p>
                  <p className="font-bold text-gray-800 truncate">
                    {lihat.nama_pelanggan || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold">No. HP</p>
                  <p className="font-bold text-gray-800">{lihat.no_hp || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold">Waktu</p>
                  <p className="font-bold text-gray-800">
                    {new Date(lihat.dibuat_pada).toLocaleString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold">Total Harga</p>
                  <p className="font-extrabold text-[#558B2F]">
                    Rp {Number(lihat.total || 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold">Metode Bayar</p>
                  <p className="font-bold text-gray-800">
                    {lihat.metode_pembayaran || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold">Status Bayar</p>
                  <p
                    className={`font-extrabold ${
                      String(lihat.status_pembayaran || "")
                        .toLowerCase()
                        .match(/lunas|paid|sudah|berhasil/)
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {lihat.status_pembayaran || "-"}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <p className="text-xs font-bold text-gray-500">Daftar Item</p>
                {lihat.items.map((it, idx) => {
                  const harga = it.subtotal ?? (it.harga ?? 0) * it.qty;
                  return (
                    <div
                      key={it.id ?? idx}
                      className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-gray-100 text-gray-500 text-xs font-bold inline-flex items-center justify-center">
                          {it.qty}x
                        </span>
                        <span className="text-gray-700">{it.nama}</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        Rp {Number(harga || 0).toLocaleString("id-ID")}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setLihat(null)}
                  className="py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-sm"
                >
                  Tutup
                </button>
                {(() => {
                  const nx = nextStatus(lihat.status);
                  if (!nx) {
                    return (
                      <button
                        disabled
                        className="py-2.5 rounded-xl bg-gray-300 text-gray-600 font-bold cursor-not-allowed text-sm"
                      >
                        Sudah Selesai
                      </button>
                    );
                  }
                  return (
                    <button
                      onClick={async () => {
                        const ok = await ubahStatus(lihat.id, nx);
                        if (ok) setLihat((l) => (l ? { ...l, status: nx } : l));
                      }}
                      disabled={submittingId === lihat.id}
                      className="py-2.5 rounded-xl bg-[#558B2F] text-white font-bold hover:bg-[#497825] transition text-sm shadow disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submittingId === lihat.id
                        ? "Menyimpan..."
                        : `→ ${nx}`}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
