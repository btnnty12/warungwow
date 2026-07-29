import {
  DollarSign,
  ClipboardList,
  ShoppingCart,
  Star,
  Calendar,
  Bell,
  ChevronDown,
  TrendingUp,
  FileDown,
  FileSpreadsheet,
  ChevronRight,
} from "lucide-react";

export default function ManagerLaporanPage() {
  const statCards = [
    {
      title: "Total Sales",
      value: "Rp 12,000,000",
      icon: DollarSign,
      iconBg: "bg-blue-500",
      change: "+18.5 %",
      changeLabel: "vs 12 Mei 2026",
      positive: true,
    },
    {
      title: "Total Order",
      value: "365",
      icon: ClipboardList,
      iconBg: "bg-red-500",
      change: "+12.5 %",
      changeLabel: "vs 12 Mei 2026",
      positive: true,
    },
    {
      title: "Avg Order Value",
      value: "Rp 3,000,000",
      icon: ShoppingCart,
      iconBg: "bg-orange-500",
      change: "+3.5 %",
      changeLabel: "vs 12 Mei 2026",
      positive: true,
    },
    {
      title: "Top Product",
      value: "Nasi Goreng",
      subValue: "122 order",
      totalValue: "Rp 12,000,000",
      icon: Star,
      iconBg: "bg-green-500",
    },
  ];

  const topSellingProducts = [
    { rank: 1, name: "Nasi Goreng Spesial", orders: "122 orders", total: "Rp 12,000,000" },
    { rank: 2, name: "Ayam Geprek", orders: "89 orders", total: "Rp 1,500,000" },
    { rank: 3, name: "Spaghetti Wow", orders: "77 orders", total: "Rp 1,125,000" },
    { rank: 4, name: "Es Teh Manis", orders: "68 orders", total: "Rp 900,000" },
    { rank: 5, name: "Kopi Hitam", orders: "54 orders", total: "Rp 250,000" },
  ];

  const operationalData = [
    { label: "Completed", count: 234, percentage: "65.2%", color: "#22c55e" },
    { label: "Processing", count: 34, percentage: "25%", color: "#f97316" },
    { label: "Cancelled", count: 15, percentage: "9.8%", color: "#ef4444" },
  ];

  const chartHours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];
  const salesData = [500000, 2000000, 3500000, 7000000, 5000000, 7500000, 6000000];
  const prevSalesData = [400000, 1500000, 2800000, 5500000, 4200000, 5800000, 5000000];
  const maxValue = 8000000;

  const kitchenPerformancePoints = [30, 70, 55, 85, 40, 75, 60, 90, 50, 70, 80, 65, 85];

  const revenueRows = [
    {
      date: "12 Mei 2026",
      totalSales: "12,000,000",
      totalOrders: "365",
      avgOrder: "3,000,000",
      payment: "QRIS, Cash, Debit",
      netRevenue: "12,654,000",
    },
    {
      date: "14 Mei 2026",
      totalSales: "11,340,000",
      totalOrders: "255",
      avgOrder: "1,300,000",
      payment: "QRIS, Cash, Debit",
      netRevenue: "10,980,000",
    },
    {
      date: "16 Mei 2026",
      totalSales: "11,000,000",
      totalOrders: "235",
      avgOrder: "1,000,000",
      payment: "QRIS, Cash, Debit",
      netRevenue: "10,500,000",
    },
  ];

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-1">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-0.5">
            Laporan
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Lihat ringkasan laporan penjualan dan operasional
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm shadow-sm">
            <Calendar size={15} className="text-gray-600" />
            <span className="text-gray-700 font-medium">20 Mei 2026 – 30 Juni 2026</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>
          <button className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
            <Bell size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center text-white shadow flex-shrink-0`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs font-medium mb-0.5">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-800 truncate">{stat.value}</p>
                  {stat.subValue && (
                    <p className="text-gray-400 text-[10px] mt-0.5">{stat.subValue}</p>
                  )}
                  {stat.totalValue && (
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {stat.totalValue}
                    </p>
                  )}
                  {stat.change && (
                    <div className="mt-1.5">
                      <div className="flex items-center gap-1">
                        <TrendingUp
                          size={12}
                          style={{ color: stat.positive ? "#16a34a" : "#dc2626" }}
                        />
                        <span
                          className="text-xs font-bold"
                          style={{ color: stat.positive ? "#16a34a" : "#dc2626" }}
                        >
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-gray-400 text-[10px] mt-0.5">{stat.changeLabel}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Analytics + Top Selling Product */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Sales Analytics */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Sales Analytict</h3>
            <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition w-fit text-sm">
              <span className="text-gray-700 font-medium">Today</span>
              <ChevronDown size={12} className="text-gray-500" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4 mb-3 ml-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-600 rounded" />
              <span className="text-xs text-gray-600">Sales (Rp)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 border-t border-dashed border-gray-400 rounded" />
              <span className="text-xs text-gray-600">Previous Day (Rp)</span>
            </div>
          </div>
          <div className="relative h-40 sm:h-44">
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 pr-2">
              {["8M", "6M", "4M", "2M", "0"].map((l, i) => (
                <span key={i} className="text-[10px] text-gray-400 text-right w-5">
                  {l}
                </span>
              ))}
            </div>
            <div className="ml-7 h-full relative">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 700 250"
                preserveAspectRatio="none"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 50 + 25}
                    x2="700"
                    y2={i * 50 + 25}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}
                <path
                  d={`M 0 ${225 - (prevSalesData[0] / maxValue) * 200} ${prevSalesData
                    .map(
                      (v, i) =>
                        `L ${(i / (prevSalesData.length - 1)) * 700} ${
                          225 - (v / maxValue) * 200
                        }`
                    )
                    .join(" ")}`}
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 225 L 0 ${225 - (salesData[0] / maxValue) * 200} ${salesData
                    .map(
                      (v, i) =>
                        `L ${(i / (salesData.length - 1)) * 700} ${
                          225 - (v / maxValue) * 200
                        }`
                    )
                    .join(" ")} L 700 225 Z`}
                  fill="url(#sg)"
                />
                <path
                  d={`M 0 ${225 - (salesData[0] / maxValue) * 200} ${salesData
                    .map(
                      (v, i) =>
                        `L ${(i / (salesData.length - 1)) * 700} ${
                          225 - (v / maxValue) * 200
                        }`
                    )
                    .join(" ")}`}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />
                {salesData.map((v, i) => (
                  <circle
                    key={i}
                    cx={(i / (salesData.length - 1)) * 700}
                    cy={225 - (v / maxValue) * 200}
                    r="3.5"
                    fill="white"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                  />
                ))}
              </svg>
              <div className="absolute bottom-[-18px] left-0 w-full flex justify-between">
                {chartHours.map((h, i) => (
                  <span key={i} className="text-[10px] text-gray-400">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Product */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              Top Selling Product
            </h3>
            <button className="text-blue-600 font-bold hover:text-blue-700 transition text-sm">
              View All
            </button>
          </div>
          <div className="space-y-0.5">
            {topSellingProducts.map((p) => (
              <div
                key={p.rank}
                className="flex items-center py-2 px-2 hover:bg-gray-50 rounded-lg transition border-b border-gray-50 last:border-b-0"
              >
                <span className="text-gray-400 font-bold text-sm w-6 flex-shrink-0">
                  {p.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{p.name}</p>
                  <p className="text-gray-400 text-xs">{p.orders}</p>
                </div>
                <p className="font-bold text-gray-800 text-xs ml-2 flex-shrink-0">
                  {p.total}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Status + Kitchen Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Operational Status */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">
            Operational Status
          </h3>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto md:mx-0 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                {(() => {
                  let offset = 0;
                  const c = 2 * Math.PI * 38;
                  return operationalData.map((item, idx) => {
                    const pct = parseFloat(item.percentage.replace("%", "")) / 100;
                    const da = pct * c;
                    const co = offset;
                    offset += da;
                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="12"
                        strokeDasharray={`${da} ${c}`}
                        strokeDashoffset={-co}
                      />
                    );
                  });
                })()}
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              {operationalData.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-bold text-gray-700 flex-1 text-sm">
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">
                    {item.count} ({item.percentage})
                  </span>
                </div>
              ))}
              <button className="w-full mt-3 px-4 py-1.5 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition text-sm">
                View All Orders
              </button>
            </div>
          </div>
        </div>

        {/* Kitchen Performance */}
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
            <p className="text-gray-600 text-xs font-medium mb-2">
              Average Preparation Time
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-1">
              <p className="text-2xl font-bold text-gray-800">12m 45d</p>
              <div className="flex-1 h-14 relative w-full sm:w-auto">
                <svg
                  viewBox="0 0 200 96"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <path
                    d={`M 0 ${96 - kitchenPerformancePoints[0]} ${kitchenPerformancePoints
                      .map(
                        (v, i) =>
                          `L ${(i / (kitchenPerformancePoints.length - 1)) * 200} ${96 - v}`
                      )
                      .join(" ")}`}
                    fill="none"
                    stroke="#558B2F"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-gray-400">Target: &#60; 15 menit</p>
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-gray-500">Orders Completed</span>
            <span className="font-bold text-gray-700 text-sm">298</span>
          </div>
        </div>
      </div>

      {/* Revenue Report Table */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-800">Revenue Report</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-red-500 text-red-600 rounded-lg font-bold hover:bg-red-50 transition text-xs sm:text-sm">
              <FileDown size={14} />
              <span>Export PDF</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-green-600 text-green-700 rounded-lg font-bold hover:bg-green-50 transition text-xs sm:text-sm">
              <FileSpreadsheet size={14} />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2.5 px-3 text-gray-600 font-semibold text-xs sm:text-sm">
                  Date
                </th>
                <th className="text-left py-2.5 px-3 text-gray-600 font-semibold text-xs sm:text-sm">
                  Total Sales (Rp)
                </th>
                <th className="text-left py-2.5 px-3 text-gray-600 font-semibold text-xs sm:text-sm">
                  Total Orders
                </th>
                <th className="text-left py-2.5 px-3 text-gray-600 font-semibold text-xs sm:text-sm">
                  Avg Orders Value (Rp)
                </th>
                <th className="text-left py-2.5 px-3 text-gray-600 font-semibold text-xs sm:text-sm">
                  Payment Method
                </th>
                <th className="text-right py-2.5 px-3 text-gray-600 font-semibold text-xs sm:text-sm">
                  Net Revenue (Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {revenueRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="py-2.5 px-3 font-medium text-gray-800 text-xs sm:text-sm">
                    {row.date}
                  </td>
                  <td className="py-2.5 px-3 text-gray-700 text-xs sm:text-sm">
                    {row.totalSales}
                  </td>
                  <td className="py-2.5 px-3 text-gray-700 text-xs sm:text-sm">
                    {row.totalOrders}
                  </td>
                  <td className="py-2.5 px-3 text-gray-700 text-xs sm:text-sm">
                    {row.avgOrder}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs sm:text-sm">
                    {row.payment}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-gray-800 text-xs sm:text-sm">
                    {row.netRevenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-center">
          <button className="inline-flex items-center gap-1 text-blue-600 font-semibold text-xs sm:text-sm hover:text-blue-700 transition">
            <span>View Full Report</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
