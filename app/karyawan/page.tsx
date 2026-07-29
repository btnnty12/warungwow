import {
  ClipboardList,
  Package,
  Calendar,
  Bell,
  Clock,
  ChefHat,
} from "lucide-react";

export default function KaryawanPage() {
  const statCards = [
    {
      title: "Pesanan Hari Ini",
      value: "28",
      icon: ClipboardList,
      iconBg: "bg-blue-500",
    },
    {
      title: "Pesanan Diproses",
      value: "5",
      icon: ChefHat,
      iconBg: "bg-orange-500",
    },
    {
      title: "Stok Menipis",
      value: "3",
      icon: Package,
      iconBg: "bg-red-500",
    },
    {
      title: "Selesai Hari Ini",
      value: "23",
      icon: Clock,
      iconBg: "bg-green-500",
    },
  ];

  const recentOrders = [
    { id: "ORD-001", meja: "Meja 3", items: 4, status: "Diproses", total: "Rp 85.000" },
    { id: "ORD-002", meja: "Meja 7", items: 2, status: "Selesai", total: "Rp 42.000" },
    { id: "ORD-003", meja: "Meja 1", items: 6, status: "Diproses", total: "Rp 156.000" },
    { id: "ORD-004", meja: "Takeaway", items: 3, status: "Baru", total: "Rp 63.000" },
    { id: "ORD-005", meja: "Meja 5", items: 2, status: "Selesai", total: "Rp 38.000" },
  ];

  const statusColors: Record<string, string> = {
    Baru: "bg-blue-100 text-blue-700",
    Diproses: "bg-orange-100 text-orange-700",
    Selesai: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Header + Stats */}
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-0.5">
              Beranda Karyawan
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Kelola pesanan dan aktifitas harian
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar size={14} className="text-gray-600" />
              <span className="text-gray-700 font-medium text-xs sm:text-sm">
                22 Juli 2026
              </span>
            </div>
            <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
              <Bell size={15} className="text-gray-700" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-3 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${stat.iconBg} flex items-center justify-center text-white shadow flex-shrink-0`}
                  >
                    <Icon size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-[11px] sm:text-xs font-medium mb-0.5">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2.5">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Pesanan Terbaru</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 sm:px-3 text-gray-500 font-semibold text-[11px] sm:text-xs">
                  ID Pesanan
                </th>
                <th className="text-left py-2 px-2 sm:px-3 text-gray-500 font-semibold text-[11px] sm:text-xs">
                  Meja
                </th>
                <th className="text-left py-2 px-2 sm:px-3 text-gray-500 font-semibold text-[11px] sm:text-xs">
                  Jumlah Item
                </th>
                <th className="text-left py-2 px-2 sm:px-3 text-gray-500 font-semibold text-[11px] sm:text-xs">
                  Total
                </th>
                <th className="text-left py-2 px-2 sm:px-3 text-gray-500 font-semibold text-[11px] sm:text-xs">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-2 sm:px-3 font-bold text-gray-800 text-xs sm:text-sm">
                    {order.id}
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm">
                    {order.meja}
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm">
                    {order.items} item
                  </td>
                  <td className="py-2 px-2 sm:px-3 font-bold text-gray-800 text-xs sm:text-sm">
                    {order.total}
                  </td>
                  <td className="py-2 px-2 sm:px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold ${
                        statusColors[order.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
