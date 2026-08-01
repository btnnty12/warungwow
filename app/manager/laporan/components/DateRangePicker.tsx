"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar, ChevronDown, X, Check } from "lucide-react";

type Preset = {
  label: string;
  range: () => { start: string; end: string };
};

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shiftDate(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

const PRESETS: Preset[] = [
  {
    label: "Hari ini",
    range: () => ({ start: ymd(new Date()), end: ymd(new Date()) }),
  },
  {
    label: "Kemarin",
    range: () => {
      const kem = shiftDate(new Date(), -1);
      return { start: ymd(kem), end: ymd(kem) };
    },
  },
  {
    label: "7 hari terakhir",
    range: () => ({
      start: ymd(shiftDate(new Date(), -6)),
      end: ymd(new Date()),
    }),
  },
  {
    label: "30 hari terakhir",
    range: () => ({
      start: ymd(shiftDate(new Date(), -29)),
      end: ymd(new Date()),
    }),
  },
  {
    label: "Bulan ini",
    range: () => {
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: ymd(first), end: ymd(last) };
    },
  },
  {
    label: "Bulan lalu",
    range: () => {
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: ymd(first), end: ymd(last) };
    },
  },
  {
    label: "Semua data",
    range: () => ({ start: "2020-01-01", end: ymd(new Date()) }),
  },
];

function formatID(ymdStr: string) {
  if (!ymdStr) return "";
  try {
    const [y, m, d] = ymdStr.split("-").map(Number);
    const date = new Date(y, (m || 1) - 1, d || 1);
    if (Number.isNaN(date.getTime())) return ymdStr;
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return ymdStr;
  }
}

type Props = {
  mode?: "fixed-today" | "range";
};

export default function DateRangePicker({ mode = "range" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const today = useMemo(() => ymd(new Date()), []);
  const defaultStart = useMemo(
    () => ymd(shiftDate(new Date(), -6)),
    []
  );

  const initialStart =
    mode === "fixed-today"
      ? today
      : params.get("start") || defaultStart;
  const initialEnd =
    mode === "fixed-today" ? today : params.get("end") || today;

  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);

  useEffect(() => {
    setStart(initialStart);
    setEnd(initialEnd);
  }, [initialStart, initialEnd]);

  useEffect(() => {
    if (!open) return;
    function onClickDoc(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
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

  const presetAktif = useMemo(() => {
    for (const p of PRESETS) {
      const r = p.range();
      if (r.start === initialStart && r.end === initialEnd) return p.label;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStart, initialEnd]);

  const labelTampil = useMemo(() => {
    if (mode === "fixed-today") {
      return `Hari ini, ${formatID(today)}`;
    }
    if (presetAktif) return presetAktif;
    if (start === end) return formatID(start);
    return `${formatID(start)} – ${formatID(end)}`;
  }, [mode, presetAktif, start, end, today]);

  function applyRange(s: string, e: string) {
    setStart(s);
    setEnd(e);
    if (mode === "fixed-today") {
      setOpen(false);
      return;
    }
    const sp = new URLSearchParams(params.toString());
    sp.set("start", s);
    sp.set("end", e);
    router.push(`${pathname}?${sp.toString()}`);
    setOpen(false);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => (mode === "fixed-today" ? null : setOpen((v) => !v))}
        disabled={mode === "fixed-today"}
        className={`flex items-center gap-2 px-3 py-2 ${
          mode === "fixed-today"
            ? "bg-gray-50 border border-gray-200 cursor-default rounded-lg shadow-sm"
            : "bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm cursor-pointer"
        } text-sm`}
      >
        <Calendar size={15} className="text-gray-600" />
        <span className="text-gray-700 font-medium">{labelTampil}</span>
        {mode !== "fixed-today" && (
          <ChevronDown
            size={14}
            className={`text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {open && mode !== "fixed-today" && (
        <div className="absolute right-0 mt-2 w-[min(92vw,380px)] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[60] overflow-hidden">
          <div className="px-4 py-3 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Pilih Rentang Waktu</h3>
              <p className="text-[11px] text-gray-500">
                Filter laporan berdasarkan tanggal transaksi
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-gray-200/70 flex items-center justify-center text-gray-500"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 p-4 border-b border-gray-100">
            <div className="col-span-7 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
              <label className="flex-1">
                <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                  Tanggal Mulai
                </span>
                <input
                  type="date"
                  value={start}
                  max={end || today}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F54EB]/40 focus:border-[#2F54EB]"
                />
              </label>
              <label className="flex-1">
                <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                  Tanggal Akhir
                </span>
                <input
                  type="date"
                  value={end}
                  min={start || "2020-01-01"}
                  max={today}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F54EB]/40 focus:border-[#2F54EB]"
                />
              </label>
              <button
                type="button"
                onClick={() => applyRange(start || defaultStart, end || today)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2F54EB] text-white text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap"
              >
                <Check size={14} />
                Terapkan
              </button>
            </div>
          </div>

          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((p) => {
              const r = p.range();
              const aktif = r.start === initialStart && r.end === initialEnd;
              return (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => applyRange(r.start, r.end)}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-left transition ${
                    aktif
                      ? "bg-[#2F54EB] text-white shadow"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
