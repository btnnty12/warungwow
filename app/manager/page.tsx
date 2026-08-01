import {
  Bell,
  Calendar,
  ChevronDown,
  ClipboardList,
  DollarSign,
  Hand,
  ShoppingCart,
  Star,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import SummaryCard from "./laporan/components/SummaryCard";
import SalesChart from "./laporan/components/SalesChart";
import TopProduct from "./laporan/components/TopProduct";
import OperationalStatus from "./laporan/components/OperationalStatus";
import DateRangePicker from "./laporan/components/DateRangePicker";
import NotifikasiBell from "./laporan/components/NotifikasiBell";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function rangeHariIni() {
  const t = ymd(new Date());
  return { start: t, end: t };
}

function gteStart(d: string | null | undefined, start: string) {
  if (!d) return false;
  return d.slice(0, 10) >= start;
}
function lteEnd(d: string | null | undefined, end: string) {
  if (!d) return false;
  return d.slice(0, 10) <= end;
}
function dalamRange(d: string | null | undefined, start: string, end: string) {
  return gteStart(d, start) && lteEnd(d, end);
}

function buildTopProducts(detailRows: any[], start: string, end: string) {
  const produkMap: Record<string, { jumlah: number; pendapatan: number }> = {};
  detailRows.forEach((item: any) => {
    const tglPesanan = item.pesanan?.dibuat_pada;
    const statusOk = item.pesanan?.status_pesanan === "selesai";
    if (!statusOk || !dalamRange(tglPesanan, start, end)) return;
    const namaProduk = item.produk?.nama_produk;
    if (!namaProduk) return;
    if (!produkMap[namaProduk]) {
      produkMap[namaProduk] = { jumlah: 0, pendapatan: 0 };
    }
    produkMap[namaProduk].jumlah += Number(item.jumlah || 0);
    produkMap[namaProduk].pendapatan += Number(item.subtotal || 0);
  });
  return Object.entries(produkMap)
    .map(([nama, value]) => ({
      nama_produk: nama,
      jumlah_order: value.jumlah,
      total_penjualan: value.pendapatan,
    }))
    .sort((a, b) => b.jumlah_order - a.jumlah_order);
}

async function getDashboardData(start: string, end: string) {
  const [pesananRes, detailRes] = await Promise.allSettled([
    supabase
      .from("pesanan")
      .select(
        "id, total_harga, dibuat_pada, status_pesanan, metode_pembayaran"
      )
      .order("dibuat_pada", { ascending: true }),
    supabase
      .from("detail_pesanan")
      .select(
        `jumlah, subtotal, produk (nama_produk, harga), pesanan (status_pesanan, dibuat_pada)`
      ),
  ]);

  const pesanan =
    pesananRes.status === "fulfilled" && pesananRes.value.data
      ? (pesananRes.value.data as any[])
      : [];
  const detail =
    detailRes.status === "fulfilled" && detailRes.value.data
      ? (detailRes.value.data as any[])
      : [];

  if (pesananRes.status === "fulfilled" && pesananRes.value.error) {
    console.warn("pesanan error:", pesananRes.value.error);
  }
  if (detailRes.status === "fulfilled" && detailRes.value.error) {
    console.warn("detail_pesanan error:", detailRes.value.error);
  }

  const pesananSelesaiRange = pesanan.filter(
    (p) =>
      p.status_pesanan === "selesai" &&
      dalamRange(p.dibuat_pada, start, end)
  );

  const totalOrder = pesananSelesaiRange.length;
  const totalSales = pesananSelesaiRange.reduce(
    (total, item) => total + Number(item.total_harga),
    0
  );
  const avgOrderValue = totalOrder > 0 ? totalSales / totalOrder : 0;

  const semuaProduk = buildTopProducts(detail, start, end);
  const topProduct = semuaProduk[0] || null;

  const pesananRangeAll = pesanan.filter((p) =>
    dalamRange(p.dibuat_pada, start, end)
  );
  let completed = 0;
  let processing = 0;
  let cancelled = 0;
  pesananRangeAll.forEach((item: any) => {
    switch (item.status_pesanan) {
      case "selesai":
        completed++;
        break;
      case "diterima_dapur":
      case "sedang_dibuat":
      case "sedang_diantar":
        processing++;
        break;
      case "dibatalkan":
        cancelled++;
        break;
    }
  });
  const total = completed + processing + cancelled;
  const operational = {
    completed: {
      jumlah: completed,
      persentase:
        total > 0 ? Number(((completed / total) * 100).toFixed(1)) : 0,
    },
    processing: {
      jumlah: processing,
      persentase:
        total > 0 ? Number(((processing / total) * 100).toFixed(1)) : 0,
    },
    cancelled: {
      jumlah: cancelled,
      persentase:
        total > 0 ? Number(((cancelled / total) * 100).toFixed(1)) : 0,
    },
    totalOrder: total,
  };

  return {
    summary: {
      totalSales,
      totalOrder,
      avgOrderValue,
      topProduct: topProduct
        ? {
            nama: topProduct.nama_produk,
            jumlahOrder: topProduct.jumlah_order,
            pendapatan: topProduct.total_penjualan,
          }
        : null,
    },
    sales: buildSales(pesanan, start, end),
    operational,
    products: semuaProduk,
  };
}

function buildSales(pesanan: any[], start: string, end: string) {
  function dateYMD(d: Date) {
    return d.toISOString().split("T")[0];
  }
  const today = new Date();
  const todayStr = dateYMD(today);
  const yesterdayD = new Date(today);
  yesterdayD.setDate(today.getDate() - 1);
  const yesterdayStr = dateYMD(yesterdayD);

  const hourlyToday: Record<number, number> = {};
  const hourlyYesterday: Record<number, number> = {};
  for (let i = 0; i < 24; i++) {
    hourlyToday[i] = 0;
    hourlyYesterday[i] = 0;
  }

  let todayTotal = 0;
  let previousDayTotal = 0;

  pesanan.forEach((item: any) => {
    if (item.status_pesanan !== "selesai") return;
    const date = new Date(item.dibuat_pada);
    const jam = date.getHours();
    const tanggal = dateYMD(date);
    const harga = Number(item.total_harga || 0);

    if (tanggal === todayStr && dalamRange(item.dibuat_pada, start, end)) {
      hourlyToday[jam] += harga;
      todayTotal += harga;
    }
    if (tanggal === yesterdayStr && dalamRange(item.dibuat_pada, start, end)) {
      hourlyYesterday[jam] += harga;
      previousDayTotal += harga;
    }
  });

  return {
    todayTotal,
    previousDayTotal,
    chart: Array.from({ length: 24 }, (_, index) => ({
      jam: `${String(index).padStart(2, "0")}:00`,
      today: hourlyToday[index],
      previousDay: hourlyYesterday[index],
    })),
  };
}

export default async function ManagerPage() {
  const { start, end } = rangeHariIni();
  const { summary, sales, operational, products } = await getDashboardData(
    start,
    end
  );

  const statCards = [
    {
      title: "Total Sales",
      value: formatCurrency(summary.totalSales),
      icon: DollarSign,
      iconBg: "bg-blue-500",
      change: "+18.5%",
      changeLabel: "vs hari sebelumnya",
      positive: true,
    },
    {
      title: "Total Order",
      value: String(summary.totalOrder),
      icon: ClipboardList,
      iconBg: "bg-red-500",
      change: "+12.5%",
      changeLabel: "vs hari sebelumnya",
      positive: true,
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(summary.avgOrderValue),
      icon: ShoppingCart,
      iconBg: "bg-orange-500",
      change: "+3.5%",
      changeLabel: "vs hari sebelumnya",
      positive: true,
    },
    {
      title: "Top Product",
      value: summary.topProduct?.nama ?? "-",
      subValue: `${summary.topProduct?.jumlahOrder ?? 0} order`,
      totalValue: summary.topProduct
        ? formatCurrency(summary.topProduct.pendapatan)
        : "-",
      icon: Star,
      iconBg: "bg-green-500",
    },
  ];

  const kitchenPerformancePoints = [
    30, 70, 55, 85, 40, 75, 60, 90, 50, 70, 80, 65, 85,
  ];

  const labelHariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
          Hello, Manager
          <Hand size={22} className="text-yellow-500" strokeWidth={2} />
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker mode="fixed-today" />
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs">
            <Calendar size={14} className="text-gray-600" />
            <span className="text-gray-700 font-medium">{labelHariIni}</span>
          </div>
          <NotifikasiBell forRole="manager" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {statCards.map((stat, idx) => (
          <SummaryCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
        <SalesChart
          chart={sales.chart}
          todayTotal={sales.todayTotal}
          previousDayTotal={sales.previousDayTotal}
        />
        <TopProduct products={products} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <OperationalStatus
          completed={operational.completed}
          processing={operational.processing}
          cancelled={operational.cancelled}
        />

        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              Kitchen Performance
            </h3>
            <span className="px-3 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold w-fit">
              On Target
            </span>
          </div>
          <div className="p-3 border border-gray-200 rounded-xl mb-2">
            <p className="text-gray-700 text-xs font-semibold mb-2">
              Average Preparation Time
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-1">
              <p className="text-2xl font-bold text-gray-800">12m 45d</p>
              <div className="flex-1 h-16 relative w-full sm:w-auto">
                <svg
                  viewBox="0 0 200 96"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <path
                    d={`M 0 ${
                      96 - kitchenPerformancePoints[0]
                    } ${kitchenPerformancePoints
                      .map(
                        (v, i) =>
                          `L ${
                            (i / (kitchenPerformancePoints.length - 1)) * 200
                          } ${96 - v}`
                      )
                      .join(" ")}`}
                    fill="none"
                    stroke="#558B2F"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-gray-600">Target: {"<"} 15 menit</p>
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-gray-500">Orders Completed</span>
            <span className="font-bold text-gray-700 text-sm">
              {operational.totalOrder}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
