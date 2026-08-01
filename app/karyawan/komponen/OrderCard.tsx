import {
  Play,
  Eye,
  CheckCircle2,
  Bike,
} from "lucide-react";

type Item = {
  nama: string;
  jumlah: number;
};

type Props = {
  nomor: string;
  meja: string;
  waktu: string;
  total: number;
  status: "Baru" | "Dibuat" | "Diantar" | "Selesai";
  items: Item[];
};

export default function OrderCard({
  meja,
  waktu,
  status,
  items,
}: Props) {
  const warna =
    status === "Baru"
      ? "bg-[#155CCB]"
      : status === "Dibuat"
      ? "bg-[#FF8A00]"
      : "bg-[#43A047]";

  return (
    <div className="flex bg-white rounded-2xl shadow-md overflow-hidden min-h-[165px]">

      {/* Panel kiri */}
      <div
        className={`${warna} w-[155px] flex flex-col justify-center items-center text-white`}
      >
        <p className="text-sm font-semibold tracking-wide">
          MEJA
        </p>

        <h2 className="text-[42px] font-bold leading-none mt-2">
          {meja.replace("Meja ", "")}
        </h2>

        <p className="text-[22px] font-bold mt-4">
          {waktu}
        </p>

        <p className="text-base font-semibold mt-1">
          {status}
        </p>
      </div>

      {/* Isi */}
      <div className="flex-1 flex justify-between items-center px-7 py-5">

        {/* Daftar Menu */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {items.length} Item
          </h3>

          <ul className="space-y-1">
            {items.map((item, index) => (
              <li
                key={index}
                className="text-lg text-gray-800"
              >
                • {item.jumlah}x {item.nama}
              </li>
            ))}
          </ul>
        </div>

        {/* Tombol */}
        <div className="w-44 flex flex-col gap-3">

          {status === "Baru" && (
            <button className="h-11 rounded-xl bg-[#2F54EB] text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
              <Play size={16} />
              Mulai Buat
            </button>
          )}

          {status === "Dibuat" && (
            <button className="h-11 rounded-xl bg-[#FF8A00] text-white font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition">
              <Bike size={16} />
              Siap Diantar
            </button>
          )}

          {status === "Diantar" && (
            <button className="h-11 rounded-xl bg-[#43A047] text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition">
              <CheckCircle2 size={16} />
              Selesaikan
            </button>
          )}

          {status === "Selesai" && (
            <button
              disabled
              className="h-11 rounded-xl bg-gray-300 text-gray-600 font-semibold cursor-not-allowed"
            >
              Pesanan Selesai
            </button>
          )}

          <button className="h-11 rounded-xl border-2 border-gray-400 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition">
            <Eye size={16} />
            Lihat Detail
          </button>

        </div>
      </div>
    </div>
  );
}