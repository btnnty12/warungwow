"use client";

import { useState, useMemo } from "react";
import {
  Package,
  Calendar,
  Bell,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
} from "lucide-react";

type Bahan = {
  id: number;
  nama: string;
  kategori: string;
  satuan: string;
  stok: number;
};

type StatusStok = "Habis" | "Sedikit" | "Aman";

const AWAL: Bahan[] = [
  { id: 1, nama: "Beras", kategori: "Bahan Pokok", satuan: "Kg", stok: 5 },
  { id: 2, nama: "Minyak Goreng", kategori: "Bahan Pokok", satuan: "Liter", stok: 9 },
  { id: 3, nama: "Sayur Bayem", kategori: "Bahan Segar", satuan: "Butir", stok: 12 },
  { id: 4, nama: "Buah Jambu", kategori: "Bahan Segar", satuan: "Kg", stok: 25 },
  { id: 5, nama: "Bawang Merah", kategori: "Bumbu", satuan: "Kg", stok: 2 },
];

function hitungStatus(b: Bahan): StatusStok {
  if (b.stok <= 5) return "Habis";
  if (b.stok <= 15) return "Sedikit";
  return "Aman";
}

const BADGE: Record<StatusStok, string> = {
  Habis: "bg-red-50 text-red-700 border border-red-300",
  Sedikit: "bg-yellow-50 text-yellow-700 border border-yellow-300",
  Aman: "bg-green-50 text-green-700 border border-green-300",
};

export default function ManagerStokPage() {
  const [data, setData] = useState<Bahan[]>(AWAL);
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState<string>("semua");
  const [bukaKategori, setBukaKategori] = useState(false);
  const [bukaTambah, setBukaTambah] = useState(false);
  const [bukaEdit, setBukaEdit] = useState<Bahan | null>(null);

  const semuaKategori = useMemo(
    () => ["semua", ...Array.from(new Set(data.map((d) => d.kategori)))],
    [data]
  );

  const terfilter = useMemo(() => {
    return data.filter((b) => {
      const q = cari.trim().toLowerCase();
      const matchQ = !q || b.nama.toLowerCase().includes(q) || b.kategori.toLowerCase().includes(q);
      const matchK = kategori === "semua" || b.kategori === kategori;
      return matchQ && matchK;
    });
  }, [data, cari, kategori]);

  const hapus = (id: number) => {
    if (confirm("Hapus bahan ini dari daftar stok?")) {
      setData(arr => arr.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4 sm:mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-[#558B2F]" size={26} />
              Stok
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Pantau dan kelola persediaan bahan
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar size={14} className="text-gray-600" />
              <span className="text-gray-700 font-medium text-sm">22 Juli 2026</span>
            </div>
            <button className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
              <Bell size={16} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search · Kategori · + Tambah Stok */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center mb-4">
          <div className="relative flex-1 lg:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={cari}
            onChange={e => setCari(e.target.value)}
            placeholder="Cari bahan..."
            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F]/40 text-sm transition"
          />
        </div>

          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            {/* Dropdown Kategori */}
            <div className="relative">
              <button
                onClick={() => setBukaKategori(v => !v)}
                className="px-3.5 h-10 inline-flex items-center gap-1.5 bg-white border border-[#558B2F]/30 text-[#558B2F] rounded-xl font-bold text-sm hover:bg-green-50 transition shadow-sm"
              >
                {kategori === "semua" ? "Kategori" : kategori}
                <ChevronRight size={15} className={bukaKategori ? "rotate-90" : ""} />
              </button>
              {bukaKategori && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setBukaKategori(false)} />
                  <div className="absolute right-0 top-full mt-1.5 z-30 bg-white shadow-xl border border-gray-200 rounded-xl py-1.5 w-44 max-h-64 overflow-y-auto">
                    {semuaKategori.map(k => (
                      <button
                        key={k}
                        onClick={() => { setKategori(k); setBukaKategori(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm transition ${
                          k === kategori
                            ? "bg-green-50 text-[#558B2F] font-bold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-semibold"
                        }`}
                      >
                        {k === "semua" ? "Semua Kategori" : k}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setBukaTambah(true)}
              className="px-4 h-10 bg-[#558B2F] text-white rounded-xl flex items-center gap-1.5 text-sm font-bold hover:bg-[#497825] transition shadow-md"
            >
              <Plus size={16} /> Tambah Stok
            </button>
          </div>
        </div>

        {/* Table Stok */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead className="bg-white">
                <tr className="border-b border-gray-200">
                  {["Nama Bahan", "Kategori", "Satuan", "Stok", "Status", "Detail"].map(h => (
                    <th key={h} className="text-left py-3 px-3 sm:px-5 text-gray-800 font-bold text-xs sm:text-sm">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {terfilter.map(b => {
                  const status = hitungStatus(b);
                  return (
                    <tr key={b.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                      <td className="py-3 px-3 sm:px-5 font-semibold text-gray-800 text-xs sm:text-sm">
                        {b.nama}
                      </td>
                      <td className="py-3 px-3 sm:px-5 text-gray-700 text-xs sm:text-sm font-medium">
                        {b.kategori}
                      </td>
                      <td className="py-3 px-3 sm:px-5 text-gray-600 text-xs sm:text-sm font-semibold">
                        {b.satuan}
                      </td>
                      <td className="py-3 px-3 sm:px-5 font-extrabold text-gray-800 text-xs sm:text-sm">
                        {b.stok}
                      </td>
                      <td className="py-3 px-3 sm:px-5">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold ${BADGE[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setBukaEdit(b)}
                            title="Ubah stok"
                            className="w-8 h-8 rounded-lg border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => hapus(b.id)}
                            title="Hapus"
                            className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {terfilter.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                      Tidak ada bahan yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 bg-white py-3 px-4 text-center">
            <button className="inline-flex items-center gap-1.5 text-[#558B2F] font-bold text-sm hover:underline">
              Lihat Semua Pesanan
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah Stok */}
      {bukaTambah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setBukaTambah(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#558B2F] px-5 py-4 text-white">
              <p className="text-xs opacity-90">Tambah</p>
              <p className="text-lg font-extrabold">Stok Bahan Baru</p>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const baru: Bahan = {
                id: Date.now(),
                nama: String(f.get("nama") || "Bahan baru"),
                kategori: String(f.get("kategori") || "Lainnya"),
                satuan: String(f.get("satuan") || "Kg"),
                stok: parseInt(String(f.get("stok") || "0")),
              };
              setData(arr => [baru, ...arr]);
              setBukaTambah(false);
            }} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Bahan</label>
                <input name="nama" required placeholder="Contoh: Tepung Terigu" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Kategori</label>
                  <input name="kategori" placeholder="Bahan Pokok" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Satuan</label>
                  <input name="satuan" placeholder="Kg" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Jumlah Stok</label>
                <input name="stok" type="number" min={0} defaultValue={0} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setBukaTambah(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-sm">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#558B2F] text-white font-bold hover:bg-[#497825] transition text-sm shadow">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Stok */}
      {bukaEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setBukaEdit(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 px-5 py-4 text-white">
              <p className="text-xs opacity-90">Ubah Stok</p>
              <p className="text-lg font-extrabold">{bukaEdit.nama}</p>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const nama = String(f.get("nama") || bukaEdit.nama);
              const kategori = String(f.get("kategori") || bukaEdit.kategori);
              const satuan = String(f.get("satuan") || bukaEdit.satuan);
              const stok = parseInt(String(f.get("stok") || String(bukaEdit.stok)));
              setData(arr => arr.map(x => x.id === bukaEdit.id ? { ...x, nama, kategori, satuan, stok } : x));
              setBukaEdit(null);
            }} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Bahan</label>
                <input name="nama" defaultValue={bukaEdit.nama} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Kategori</label>
                  <input name="kategori" defaultValue={bukaEdit.kategori} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Satuan</label>
                  <input name="satuan" defaultValue={bukaEdit.satuan} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Jumlah Stok</label>
                <input name="stok" type="number" min={0} defaultValue={bukaEdit.stok} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setBukaEdit(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-sm">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition text-sm shadow">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
