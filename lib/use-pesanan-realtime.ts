"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type StatusUI =
  | "Diterima"
  | "Dibuat"
  | "Diantar"
  | "Selesai"
  | "Dibatalkan";

export type StatusDB =
  | "diterima_dapur"
  | "sedang_dibuat"
  | "sedang_diantar"
  | "selesai"
  | "dibatalkan";

export const URUTAN_STATUS: StatusUI[] = [
  "Diterima",
  "Dibuat",
  "Diantar",
  "Selesai",
];

export const MAP_UI_DB: Record<StatusUI, StatusDB> = {
  Diterima: "diterima_dapur",
  Dibuat: "sedang_dibuat",
  Diantar: "sedang_diantar",
  Selesai: "selesai",
  Dibatalkan: "dibatalkan",
};

export const MAP_DB_UI: Record<StatusDB, StatusUI> = {
  diterima_dapur: "Diterima",
  sedang_dibuat: "Dibuat",
  sedang_diantar: "Diantar",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export type ItemPesanan = {
  id?: number;
  nama: string;
  qty: number;
  harga?: number | null;
  subtotal?: number | null;
  catatan?: string | null;
};

export type Pesanan = {
  id: number;
  kode_pesanan: string;
  no_meja: string;
  nama_pelanggan: string | null;
  no_hp: string | null;
  total: number;
  metode_pembayaran: string | null;
  status_pembayaran: string | null;
  status: StatusUI;
  catatan: string | null;
  dibuat_pada: string;
  diperbarui_pada: string | null;
  items: ItemPesanan[];
};

type PesananRowDB = {
  id: number;
  kode_pesanan: string;
  meja_id?: number | null;
  nama_pelanggan?: string | null;
  no_hp?: string | null;
  total_harga?: number | null;
  metode_pembayaran?: string | null;
  status_pembayaran?: string | null;
  status_pesanan?: string | null;
  catatan?: string | null;
  dibuat_pada?: string | null;
  diperbarui_pada?: string | null;
};

type ItemRowDB = {
  id?: number;
  pesanan_id: number;
  nama_produk?: string | null;
  qty?: number | null;
  harga?: number | null;
  subtotal?: number | null;
  catatan?: string | null;
};

type MejaRowDB = {
  id: number;
  nomor_meja?: string | null;
  nama?: string | null;
};

const PESANAN_SELECT = `
  id,
  kode_pesanan,
  meja_id,
  nama_pelanggan,
  no_hp,
  total_harga,
  metode_pembayaran,
  status_pembayaran,
  status_pesanan,
  catatan,
  dibuat_pada,
  diperbarui_pada
`;

function formatNoMeja(mejaRow: MejaRowDB | null | undefined, meja_id: number | null | undefined): string {
  let nomor: string | null = null;
  if (mejaRow) {
    nomor = mejaRow.nomor_meja || mejaRow.nama || null;
  }
  if (!nomor && meja_id) nomor = String(meja_id);
  if (!nomor) nomor = "Takeaway";
  return String(nomor).match(/^meja\s+/i) ? String(nomor) : `Meja ${nomor}`;
}

function buildFromRows(
  rows: PesananRowDB[],
  itemsByPesanan: Map<number, ItemRowDB[]>,
  mejaById: Map<number, MejaRowDB>
): Pesanan[] {
  return rows.map((r) => {
    const rawStatus = String(r.status_pesanan || "diterima_dapur").toLowerCase() as StatusDB;
    const statusDB = MAP_DB_UI[rawStatus] ? rawStatus : "diterima_dapur";
    const meja = r.meja_id ? mejaById.get(r.meja_id) : undefined;
    const items = (itemsByPesanan.get(r.id) || []).map((it) => ({
      id: it.id,
      nama: it.nama_produk || "Menu",
      qty: Number(it.qty || 1),
      harga: it.harga ?? null,
      subtotal: it.subtotal ?? null,
      catatan: it.catatan ?? null,
    }));
    return {
      id: r.id,
      kode_pesanan: r.kode_pesanan || `P-${r.id}`,
      no_meja: formatNoMeja(meja, r.meja_id ?? null),
      nama_pelanggan: r.nama_pelanggan || null,
      no_hp: r.no_hp || null,
      total: Number(r.total_harga || 0),
      metode_pembayaran: r.metode_pembayaran || null,
      status_pembayaran: r.status_pembayaran || null,
      status: MAP_DB_UI[statusDB],
      catatan: r.catatan || null,
      dibuat_pada: r.dibuat_pada || new Date().toISOString(),
      diperbarui_pada: r.diperbarui_pada || null,
      items,
    };
  });
}

function getPenggunaAktif(): { auth_id: string | null } {
  if (typeof window === "undefined") return { auth_id: null };
  try {
    const raw = localStorage.getItem("auth_user");
    if (!raw) return { auth_id: null };
    const u = JSON.parse(raw);
    return { auth_id: u.auth_id || u.id || null };
  } catch {
    return { auth_id: null };
  }
}

export function usePesananRealtime() {
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsMap, setItemsMap] = useState<Map<number, ItemRowDB[]>>(new Map());
  const [mejaMap, setMejaMap] = useState<Map<number, MejaRowDB>>(new Map());

  async function ambilMejaDanItem(ids: number[]): Promise<{
    items: Map<number, ItemRowDB[]>;
    meja: Map<number, MejaRowDB>;
  }> {
    const itemsByPesanan = new Map<number, ItemRowDB[]>();
    const mejaById = new Map<number, MejaRowDB>();

    const [itemsRes, mejaRes] = await Promise.allSettled([
      supabase
        .from("pesanan_item")
        .select("id, pesanan_id, nama_produk, qty, harga, subtotal, catatan")
        .in("pesanan_id", ids.length ? ids : [0]),
      supabase.from("meja").select("id, nomor_meja, nama"),
    ]);

    if (itemsRes.status === "fulfilled" && itemsRes.value.data) {
      (itemsRes.value.data as ItemRowDB[]).forEach((row) => {
        const pid = row.pesanan_id;
        const arr = itemsByPesanan.get(pid) || [];
        arr.push(row);
        itemsByPesanan.set(pid, arr);
      });
    } else if (itemsRes.status === "rejected") {
      console.warn("ambil pesanan_item gagal (abaikan jika tabel belum ada):", itemsRes.reason);
    } else if (itemsRes.status === "fulfilled" && itemsRes.value.error) {
      console.warn("ambil pesanan_item error (abaikan jika tabel belum ada):", itemsRes.value.error);
    }

    if (mejaRes.status === "fulfilled" && mejaRes.value.data) {
      (mejaRes.value.data as MejaRowDB[]).forEach((m) => mejaById.set(m.id, m));
    } else if (mejaRes.status === "rejected") {
      console.warn("ambil meja gagal (abaikan jika tabel belum ada):", mejaRes.reason);
    } else if (mejaRes.status === "fulfilled" && mejaRes.value.error) {
      console.warn("ambil meja error (abaikan jika tabel belum ada):", mejaRes.value.error);
    }

    return { items: itemsByPesanan, meja: mejaById };
  }

  async function ambilSemua() {
    try {
      setLoading(true);
      setError(null);

      const { data: rows, error: err } = await supabase
        .from("pesanan")
        .select(PESANAN_SELECT)
        .order("dibuat_pada", { ascending: false });
      if (err) throw err;
      const pesananRows = (rows as PesananRowDB[]) || [];
      const ids = pesananRows.map((r) => r.id);

      const { items, meja } = await ambilMejaDanItem(ids);
      setItemsMap(items);
      setMejaMap(meja);
      setPesanan(buildFromRows(pesananRows, items, meja));
    } catch (e: any) {
      console.error("ambilSemua gagal:", e);
      setError(e?.message || "Gagal memuat data pesanan.");
    } finally {
      setLoading(false);
    }
  }

  async function ambilSatu(id: number): Promise<Pesanan | null> {
    try {
      const { data: row, error: err } = await supabase
        .from("pesanan")
        .select(PESANAN_SELECT)
        .eq("id", id)
        .single();
      if (err) throw err;
      const { items, meja } = await ambilMejaDanItem([id]);
      return buildFromRows([row as PesananRowDB], items, meja)[0] || null;
    } catch (e) {
      console.error("ambilSatu gagal:", e);
      return null;
    }
  }

  useEffect(() => {
    ambilSemua();

    const channel = supabase
      .channel("pesanan-warung-wow")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pesanan" },
        async (payload: any) => {
          console.log("Realtime INSERT pesanan:", payload.new?.kode_pesanan);
          const p = await ambilSatu(payload.new.id);
          if (p) setPesanan((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "pesanan" },
        async (payload: any) => {
          console.log(
            "Realtime UPDATE pesanan:",
            payload.new?.kode_pesanan,
            "→",
            payload.new?.status_pesanan
          );
          setPesanan((prev) => {
            const st = MAP_DB_UI[
              String(payload.new.status_pesanan || "diterima_dapur").toLowerCase() as StatusDB
            ];
            return prev.map((x) =>
              x.id === payload.new.id
                ? {
                    ...x,
                    kode_pesanan: payload.new.kode_pesanan || x.kode_pesanan,
                    nama_pelanggan: payload.new.nama_pelanggan ?? x.nama_pelanggan,
                    no_hp: payload.new.no_hp ?? x.no_hp,
                    total:
                      typeof payload.new.total_harga === "number"
                        ? payload.new.total_harga
                        : x.total,
                    metode_pembayaran:
                      payload.new.metode_pembayaran ?? x.metode_pembayaran,
                    status_pembayaran:
                      payload.new.status_pembayaran ?? x.status_pembayaran,
                    catatan: payload.new.catatan ?? x.catatan,
                    status: st || x.status,
                    diperbarui_pada: payload.new.diperbarui_pada || x.diperbarui_pada,
                  }
                : x
            );
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "pesanan" },
        (payload: any) => {
          console.log("Realtime DELETE pesanan:", payload.old?.id);
          setPesanan((prev) => prev.filter((x) => x.id !== payload.old?.id));
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("Realtime channel status:", status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function tulisRiwayat(pesanan_id: number, statusDB: StatusDB, auth_id: string | null): Promise<void> {
    try {
      let pengguna_id: number | null = null;
      if (auth_id) {
        const { data, error: eSel } = await supabase
          .from("pengguna")
          .select("id")
          .eq("auth_id", auth_id)
          .maybeSingle();
        if (!eSel && data) pengguna_id = (data as { id: number }).id;
      }
      const row: Record<string, unknown> = {
        pesanan_id,
        status: statusDB,
        dibuat_pada: new Date().toISOString(),
      };
      if (pengguna_id != null) row.diperbarui_oleh = pengguna_id;
      const { error: err } = await supabase.from("riwayat_status_pesanan").insert(row);
      if (err) console.warn("insert riwayat_status_pesanan gagal:", err);
    } catch (e) {
      console.warn("tulisRiwayat exception:", e);
    }
  }

  async function ubahStatus(id: number, statusUI: StatusUI): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const statusDB = MAP_UI_DB[statusUI];
        const sekarang = new Date().toISOString();
        const { auth_id } = getPenggunaAktif();
        const { error: err } = await supabase
          .from("pesanan")
          .update({ status_pesanan: statusDB, diperbarui_pada: sekarang })
          .eq("id", id);
        if (err) {
          alert("Gagal ubah status: " + err.message);
          resolve(false);
          return;
        }
        await tulisRiwayat(id, statusDB, auth_id);
        setPesanan((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: statusUI, diperbarui_pada: sekarang } : p
          )
        );
        resolve(true);
      } catch (e: any) {
        console.error("ubahStatus gagal:", e);
        alert("Gagal ubah status: " + (e?.message || "error"));
        resolve(false);
      }
    });
  }

  function nextStatus(curr: StatusUI): StatusUI | null {
    const idx = URUTAN_STATUS.indexOf(curr);
    if (idx === -1 || idx === URUTAN_STATUS.length - 1) return null;
    return URUTAN_STATUS[idx + 1];
  }

  const pesananAktif = useMemo(
    () => pesanan.filter((p) => p.status !== "Selesai" && p.status !== "Dibatalkan"),
    [pesanan]
  );

  const ringkasan = useMemo(() => {
    const h = (s: StatusUI) => pesanan.filter((p) => p.status === s).length;
    return {
      semua: pesanan.length,
      aktif: pesananAktif.length,
      Diterima: h("Diterima"),
      Dibuat: h("Dibuat"),
      Diantar: h("Diantar"),
      Selesai: h("Selesai"),
      Dibatalkan: h("Dibatalkan"),
    };
  }, [pesanan, pesananAktif]);

  const pesananTerurut = useMemo(() => {
    return [...pesanan].sort((a, b) => {
      const ia = URUTAN_STATUS.indexOf(a.status);
      const ib = URUTAN_STATUS.indexOf(b.status);
      if (ia !== ib) return ia - ib;
      return +new Date(a.dibuat_pada) - +new Date(b.dibuat_pada);
    });
  }, [pesanan]);

  return {
    pesanan,
    pesananAktif,
    pesananTerurut,
    loading,
    error,
    ringkasan,
    refresh: ambilSemua,
    ubahStatus,
    nextStatus,
  };
}
