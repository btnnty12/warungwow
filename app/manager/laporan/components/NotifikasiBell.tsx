"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, X, ChevronRight, Package, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type NotifItem = {
  id: number;
  kode_pesanan: string;
  no_meja: string;
  nama_pelanggan: string | null;
  status: string;
  status_warna: string;
  status_badge: string;
  total_harga: number;
  dibuat_pada: string;
  diperbarui_pada: string | null;
  unread: boolean;
};

const WARNA_STATUS: Record<string, { badge: string; text: string }> = {
  diterima_dapur: { badge: "bg-blue-100", text: "text-blue-700" },
  sedang_dibuat: { badge: "bg-orange-100", text: "text-orange-700" },
  sedang_diantar: { badge: "bg-green-100", text: "text-green-700" },
  selesai: { badge: "bg-gray-100", text: "text-gray-700" },
  dibatalkan: { badge: "bg-red-100", text: "text-red-700" },
};

const LABEL_STATUS: Record<string, string> = {
  diterima_dapur: "Pesanan Baru",
  sedang_dibuat: "Sedang Dibuat",
  sedang_diantar: "Sedang Diantar",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export default function NotifikasiBell({
  forRole = "manager",
}: {
  forRole?: "manager" | "karyawan";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotifItem[]>([]);
  const [lastReadId, setLastReadId] = useState<number>(0);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const storageKey = `notif_last_read_${forRole}`;

  async function fetchNotif() {
    try {
      setLoading(true);
      const { data: pesanan, error: errP } = await supabase
        .from("pesanan")
        .select(
          `id, kode_pesanan, meja_id, nama_pelanggan, total_harga, status_pesanan, dibuat_pada, diperbarui_pada`
        )
        .order("dibuat_pada", { ascending: false })
        .limit(20);
      if (errP) throw errP;

      const mejaIds = Array.from(
        new Set(
          (pesanan || [])
            .map((p: any) => p.meja_id)
            .filter((x: any) => typeof x === "number")
        )
      ) as number[];
      const mejaMap = new Map<number, string>();
      if (mejaIds.length > 0) {
        const { data: mejaRows } = await supabase
          .from("meja")
          .select("id, nomor_meja, nama");
        (mejaRows || []).forEach((m: any) => {
          const nomor = m.nomor_meja || m.nama || String(m.id);
          mejaMap.set(
            m.id,
            String(nomor).match(/^meja\s+/i) ? String(nomor) : `Meja ${nomor}`
          );
        });
      }

      const rows: NotifItem[] = (pesanan || []).map((p: any) => {
        const st = String(p.status_pesanan || "diterima_dapur").toLowerCase();
        const w = WARNA_STATUS[st] || WARNA_STATUS.diterima_dapur;
        const nomorMeja = p.meja_id
          ? mejaMap.get(p.meja_id) || `Meja ${p.meja_id}`
          : "Takeaway";
        return {
          id: p.id,
          kode_pesanan: p.kode_pesanan || `P-${p.id}`,
          no_meja: nomorMeja,
          nama_pelanggan: p.nama_pelanggan || null,
          status: LABEL_STATUS[st] || st,
          status_warna: w.text,
          status_badge: w.badge,
          total_harga: Number(p.total_harga || 0),
          dibuat_pada: p.dibuat_pada || new Date().toISOString(),
          diperbarui_pada: p.diperbarui_pada || null,
          unread: false,
        };
      });
      setItems(rows);
    } catch (e) {
      console.error("fetchNotif error:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setLastReadId(Number(raw) || 0);
    } catch {
      /* ignore */
    }
    fetchNotif();

    const ch = supabase
      .channel(`notif-${forRole}-${Math.random().toString(36).slice(2, 8)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pesanan",
        },
        () => {
          fetchNotif();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setItems((prev) =>
      prev.map((it) => ({ ...it, unread: it.id > lastReadId }))
    );
  }, [lastReadId, items.length]);

  useEffect(() => {
    if (!open) return;
    function onClickDoc(e: MouseEvent) {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const jumlahBaru = useMemo(
    () => items.filter((it) => it.unread).length,
    [items]
  );

  function tandaiSemuaDibaca() {
    if (items.length === 0) return;
    const maxId = items.reduce((m, it) => Math.max(m, it.id), 0);
    try {
      localStorage.setItem(storageKey, String(maxId));
    } catch {
      /* ignore */
    }
    setLastReadId(maxId);
  }

  function waktuLalu(iso: string) {
    try {
      const t = +new Date(iso);
      const diff = Math.max(0, Date.now() - t);
      const menit = Math.floor(diff / 60000);
      if (menit < 1) return "Baru saja";
      if (menit < 60) return `${menit}m lalu`;
      const jam = Math.floor(menit / 60);
      if (jam < 24) return `${jam}j lalu`;
      const hari = Math.floor(jam / 24);
      return `${hari}h lalu`;
    } catch {
      return "";
    }
  }

  const hrefDetail = forRole === "karyawan" ? "/karyawan/pesanan" : "/manager/pesanan";

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
        }}
        className="relative w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
        aria-label="Notifikasi"
      >
        <Bell size={16} className="text-gray-700" />
        {jumlahBaru > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
            {jumlahBaru > 99 ? "99+" : jumlahBaru}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(92vw,380px)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[60] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
            <div>
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                Notifikasi
              </h3>
              <p className="text-[11px] text-gray-500">
                Update pesanan terbaru
              </p>
            </div>
            <div className="flex items-center gap-2">
              {jumlahBaru > 0 && (
                <button
                  type="button"
                  onClick={tandaiSemuaDibaca}
                  className="text-[11px] sm:text-xs text-[#2F54EB] font-semibold hover:underline"
                >
                  Tandai dibaca
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-gray-200/70 flex items-center justify-center text-gray-500"
                aria-label="Tutup"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="py-10 text-center text-gray-400 text-xs">
                Memuat notifikasi...
              </div>
            ) : items.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                  <Package size={24} />
                </div>
                <p className="font-semibold text-gray-700 text-sm">
                  Belum ada notifikasi
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Pesanan baru akan muncul di sini.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition cursor-pointer ${
                      it.unread ? "bg-[#2F54EB]/5" : ""
                    }`}
                    onClick={() => {
                      tandaiSemuaDibaca();
                      setOpen(false);
                      router.push(hrefDetail);
                    }}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${
                        it.status_badge
                      }`}
                    >
                      <Package
                        size={16}
                        className={it.status_warna}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-gray-800 text-xs sm:text-sm truncate">
                          {it.kode_pesanan}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${it.status_badge} ${it.status_warna}`}
                        >
                          {it.status}
                        </span>
                        {it.unread && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-[#2F54EB] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {it.no_meja}
                        {it.nama_pelanggan ? ` • ${it.nama_pelanggan}` : ""}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-semibold text-[#558B2F] tabular-nums">
                          Rp{" "}
                          {it.total_harga.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {waktuLalu(it.diperbarui_pada || it.dibuat_pada)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-gray-300 flex-shrink-0 mt-2"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
            <Link
              href={hrefDetail}
              onClick={() => {
                tandaiSemuaDibaca();
                setOpen(false);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#2F54EB] text-white text-xs sm:text-sm font-bold hover:bg-blue-700 transition"
            >
              Lihat Semua Pesanan
              <ChevronRight size={14} />
            </Link>
          </div>

          {items.some((it) => it.status === "Dibatalkan") && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-start gap-2">
              <AlertCircle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-red-700">
                Terdapat pesanan yang dibatalkan, cek detail di daftar pesanan.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
