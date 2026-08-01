import { CalendarDays, Bell } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center justify-between">
      {/* Judul */}
      <h1 className="text-[42px] font-bold text-black">
        Dapur
      </h1>

      {/* Kanan */}
      <div className="flex items-center gap-4">

        {/* Tanggal */}
        <div className="flex items-center gap-3 px-8 h-[68px] rounded-2xl border border-gray-300 bg-white shadow-sm">
          <CalendarDays
            size={30}
            className="text-gray-600"
          />

          <span className="text-[22px] font-medium text-gray-700">
            20 Mei 2026
          </span>
        </div>

        {/* Bell */}
        <button className="relative w-[68px] h-[68px] rounded-2xl border border-gray-300 bg-white shadow-sm flex items-center justify-center">

          <Bell
            size={30}
            className="text-gray-700"
          />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[12px] font-bold rounded-full w-6 h-6 flex items-center justify-center">
            3
          </span>

        </button>

      </div>
    </div>
  );
}