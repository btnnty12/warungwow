"use client";

import { useMemo, useState } from "react";
import StatCard from "./komponen/StatCard";
import {
  ClipboardList,
  ChefHat,
  Package,
  Clock,
  Calendar,
  Eye,
  X,
  Play,
  Bike,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  List,
} from "lucide-react";
import {
  usePesananRealtime,
  type Pesanan,
  type StatusUI,
} from "@/lib/use-pesanan-realtime";
import NotifikasiBell from "../manager/laporan/components/NotifikasiBell";

const STATUS_UNTUK_CARD: Record<StatusUI, "Baru" | "Dibuat" | "Diantar" | "Selesai"> = {
  Diterima: "Baru",
  Dibuat: "Dibuat",
  Diantar: "Diantar",
  Selesai: "Selesai",
  Dibatalkan: "Selesai",
};

export default function KaryawanPage() {
  const { pesananAktif, loading, error, ringkasan, refresh, ubahStatus, nextStatus } =
    usePesananRealtime();
  const [lihat, setLihat] = useState<Pesanan | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [expandedPesanan, setExpandedPesanan] = useState(false);

  const PREVIEW_PESANAN = 5;
  const displayPesanan = expandedPesanan
    ? pesananAktif
    : pesananAktif.slice(0, PREVIEW_PESANAN);
  const hasMorePesanan = pesananAktif.length > PREVIEW_PESANAN;

  const statsHariIni = useMemo(() => {
    const tgl = new Date().toDateString();
    const hariIni = pesananAktif.filter(
      (p) => new Date(p.dibuat_pada).toDateString() === tgl
    );
    return {
      baruTambahan: hariIni.filter((p) => p.status === "Diterima").length,
      dibuatTambahan: hariIni.filter((p) => p.status === "Dibuat").length,
      diantarTambahan: hariIni.filter((p) => p.status === "Diantar").length,
      selesaiTambahan: ringkasan.Selesai,
    };
  }, [pesananAktif, ringkasan]);

  async function handleAksi(p: Pesanan) {
    const nx = nextStatus(p.status);
    if (!nx) return;
    setSubmittingId(p.id);
    await ubahStatus(p.id, nx);
    setSubmittingId(null);
  }

  return (
    <div className="pt-2 sm:pt-4 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dapur</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <Calendar size={14} className="text-gray-600" />
            <span className="text-gray-700 font-medium text-sm">
              {new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
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
          <NotifikasiBell forRole="karyawan" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 text-red-700 flex items-start gap-2">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Data pesanan gagal dimuat</p>
            <p className="text-xs mt-0.5">{error}</p>
            <button
              onClick={refresh}
              className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-red-700"
            >
              <RefreshCw size={12} /> Muat Ulang
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Order Baru"
          total={ringkasan.Diterima}
          subtitle={`+${statsHariIni.baruTambahan} hari ini`}
          color="blue"
          icon={<ClipboardList size={28} />}
        />
        <StatCard
          title="Dibuat"
          total={ringkasan.Dibuat}
          subtitle={`+${statsHariIni.dibuatTambahan} hari ini`}
          color="orange"
          icon={<ChefHat size={28} />}
        />
        <StatCard
          title="Diantar"
          total={ringkasan.Diantar}
          subtitle={`+${statsHariIni.diantarTambahan} hari ini`}
          color="green"
          icon={<Package size={28} />}
        />
        <StatCard
          title="Selesai"
          total={ringkasan.Selesai}
          subtitle={`+${statsHariIni.selesaiTambahan} total`}
          color="red"
          icon={<Clock size={28} />}
        />
      </div>

      <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pesanan Aktif</h2>
            <p className="text-sm text-gray-700 mt-1">
              Daftar pesanan yang sedang diproses dapur
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-700 font-semibold">Realtime</span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#558B2F]/30 border-t-[#558B2F] rounded-full animate-spin mb-2" />
            <p className="text-gray-600 text-sm">Memuat pesanan...</p>
          </div>
        ) : pesananAktif.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle2 size={48} className="mx-auto mb-3 opacity-30 text-gray-400" />
            <p className="font-semibold text-gray-700">Belum ada pesanan yang perlu dimasak.</p>
            <p className="text-xs text-gray-600 mt-1">
              Pesanan baru dari pelanggan akan muncul otomatis di sini.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mt-4">
              {displayPesanan.map((p) => {
              const s = STATUS_UNTUK_CARD[p.status];
              const warna =
                s === "Baru"
                  ? "bg-[#155CCB]"
                  : s === "Dibuat"
                  ? "bg-[#FF8A00]"
                  : "bg-[#43A047]";
              const waktu = new Date(p.dibuat_pada).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const busy = submittingId === p.id;
              return (
                <div
                  key={p.id}
                  className="flex bg-white rounded-2xl shadow-md overflow-hidden min-h-[165px] border border-gray-100 animate-[fadeIn_0.3s_ease-out]"
                >
                  <div
                    className={`${warna} w-[130px] sm:w-[155px] flex flex-col justify-center items-center text-white p-2`}
                  >
                    <p className="text-xs sm:text-sm font-semibold tracking-wide">MEJA</p>
                    <h2 className="text-3xl sm:text-[42px] font-bold leading-none mt-2">
                      {p.no_meja.replace(/^Meja\s*/i, "")}
                    </h2>
                    <p className="text-lg sm:text-[22px] font-bold mt-3 sm:mt-4">{waktu}</p>
                    <p className="text-xs sm:text-base font-semibold mt-1">{p.status}</p>
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 px-4 sm:px-7 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-400 font-bold">
                        {p.kode_pesanan}
                        {p.nama_pelanggan ? ` • ${p.nama_pelanggan}` : ""}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {p.items.length} Item
                      </h3>
                      <ul className="space-y-0.5">
                        {p.items.slice(0, 4).map((it, i) => (
                          <li key={it.id ?? i} className="text-sm text-gray-800">
                            • {it.qty}x {it.nama}
                          </li>
                        ))}
                        {p.items.length > 4 && (
                          <li className="text-xs text-gray-600 font-semibold">
                            +{p.items.length - 4} item lainnya
                          </li>
                        )}
                      </ul>
                      <p className="mt-2 text-xs text-gray-600 font-semibold">
                        Total: <span className="text-[#558B2F]">Rp {Number(p.total || 0).toLocaleString("id-ID")}</span>
                      </p>
                    </div>

                    <div className="w-full sm:w-44 flex sm:flex-col gap-2 sm:gap-3">
                      {p.status === "Diterima" && (
                        <button
                          onClick={() => handleAksi(p)}
                          disabled={busy}
                          className="flex-1 h-11 rounded-xl bg-[#2F54EB] text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {busy ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Play size={16} />
                          )}
                          Mulai Buat
                        </button>
                      )}
                      {p.status === "Dibuat" && (
                        <button
                          onClick={() => handleAksi(p)}
                          disabled={busy}
                          className="flex-1 h-11 rounded-xl bg-[#FF8A00] text-white font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {busy ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Bike size={16} />
                          )}
                          Siap Diantar
                        </button>
                      )}
                      {p.status === "Diantar" && (
                        <button
                          onClick={() => handleAksi(p)}
                          disabled={busy}
                          className="flex-1 h-11 rounded-xl bg-[#43A047] text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {busy ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          Selesaikan
                        </button>
                      )}
                      {p.status === "Selesai" && (
                        <button
                          disabled
                          className="flex-1 h-11 rounded-xl bg-gray-300 text-gray-600 font-semibold cursor-not-allowed"
                        >
                          Pesanan Selesai
                        </button>
                      )}
                      <button
                        onClick={() => setLihat(p)}
                        className="flex-1 h-11 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                      >
                        <Eye size={16} />
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMorePesanan && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <List size={14} />
                <span>
                  Menampilkan {displayPesanan.length} dari {pesananAktif.length} pesanan aktif
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedPesanan((v) => !v)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#558B2F]/30 bg-[#558B2F]/10 text-[#37641f] hover:bg-[#558B2F]/15 transition text-sm font-bold"
              >
                {expandedPesanan ? (
                  <>
                    <ChevronUp size={15} />
                    <span>Tutup Daftar</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={15} />
                    <span>View Full List ({pesananAktif.length})</span>
                  </>
                )}
              </button>
            </div>
          )}
          </>
        )}
      </div>

      {lihat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setLihat(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="bg-[#558B2F] px-5 py-4 flex items-center justify-between gap-3">
              <div className="text-white min-w-0">
                <p className="text-xs opacity-90">{lihat.no_meja} • {lihat.kode_pesanan}</p>
                <p className="text-lg font-extrabold truncate">
                  {lihat.nama_pelanggan || "Detail Pesanan"}
                </p>
              </div>
              <button
                onClick={() => setLihat(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
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
                  <p className="text-gray-600 text-xs font-semibold">Waktu Masuk</p>
                  <p className="font-bold text-gray-800">
                    {new Date(lihat.dibuat_pada).toLocaleString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold">Status Pesanan</p>
                  <p className="font-extrabold text-[#558B2F]">{lihat.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold">Jumlah Item</p>
                  <p className="font-bold text-gray-800">{lihat.items.length} pcs</p>
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
                <p className="text-xs font-bold text-gray-700">Daftar Item</p>
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
                      className="py-2.5 rounded-xl bg-[#558B2F] text-white font-bold hover:bg-[#497825] transition text-sm shadow"
                    >
                      → {nx}
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
