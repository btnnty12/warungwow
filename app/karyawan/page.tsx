import Header from "./komponen/Header";
import StatCard from "./komponen/StatCard";
import OrderCard from "./komponen/OrderCard";

import {
  ClipboardList,
  Package,
  Clock,
  ChefHat,
  Calendar,
  Bell,
} from "lucide-react";

export default function KaryawanPage() {

  return (
    <div className="pt-6 space-y-6">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
    Dapur
  </h1>

  <div className="flex flex-wrap items-center gap-2">

    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">

      <Calendar size={14} className="text-gray-600" />

      <span className="text-gray-700 font-medium text-sm">
        20 Mei 2026
      </span>

    </div>

    <button className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">

      <Bell size={16} className="text-gray-700" />

    </button>

  </div>

</div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6 mb-8">
      <StatCard
        title="Order Baru"
        total={12}
        subtitle="+3 dari hari ini"
        color="blue"
        icon={<ClipboardList size={28} />}
      />

      <StatCard
        title="Dibuat"
        total={8}
        subtitle="+2 dari hari ini"
        color="orange"
        icon={<ChefHat size={28} />}
      />

      <StatCard
        title="Diantar"
        total={5}
        subtitle="+1 dari hari ini"
        color="green"
        icon={<Package size={28} />}
      />

      <StatCard
        title="Selesai"
        total={23}
        subtitle="+6 dari hari ini"
        color="red"
        icon={<Clock size={28} />}
      />
    </div>

    {/* Recent Orders */}
    <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100">

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pesanan Aktif
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Daftar pesanan yang sedang diproses dapur
          </p>
        </div>

        <button className="text-[#2F54EB] font-semibold hover:underline">
          Lihat Semua →
        </button>
      </div>

     <div className="flex flex-col gap-6 mt-6">

          <OrderCard
            nomor="ORD-001"
            meja="Meja 05"
            waktu="12:30"
            total={75000}
            status="Baru"
            items={[
              { nama: "Burger WOW", jumlah: 2 },
              { nama: "Teh Pucuk", jumlah: 1 },
              { nama: "Kentang Goreng", jumlah: 1 },
            ]}
          />

          <OrderCard
            nomor="ORD-002"
            meja="Meja 02"
            waktu="12:35"
            total={42000}
            status="Dibuat"
            items={[
              { nama: "Mie Goreng", jumlah: 1 },
              { nama: "Kopi Susu", jumlah: 2 },
            ]}
          />

          <OrderCard
          nomor="ORD-003"
          meja="Meja C11"
          waktu="11.00"
          total={50000}
          status="Diantar"
          items={[
            { nama: "Soto Ayam", jumlah: 1 },
            { nama: "Jeruk Peras", jumlah: 1 },
          ]}
        />

        </div>
      </div>
    </div>
  );
}