import { supabase } from "@/lib/supabase";
import {
  Search,
  ChevronRight,
  Calendar,
  Bell,
  ChevronLeft,
} from "lucide-react";

export default async function KaryawanMenuPage() {
  const [
    { data: produk, error: errorProduk },
    { data: kategori, error: errorKategori },
  ] = await Promise.all([
    supabase
      .from("produk")
      .select(`
        *,
        kategori:kategori_id (
          nama_kategori
        )
      `)
      .order("id", { ascending: false }),
    supabase.from("kategori").select("*"),
  ]);

  if (errorProduk) console.error("Error fetch produk:", errorProduk);
  if (errorKategori) console.error("Error fetch kategori:", errorKategori);

  const products = (produk || []).map((p) => ({
    id: p.id,
    name: p.nama_produk || "Produk",
    category: (p as any).kategori?.nama_kategori || "Umum",
    price: p.harga ? `Rp ${Number(p.harga).toLocaleString("id-ID")}` : "Rp 0",
    status: p.status === "tersedia" ? "Tersedia" : "Habis",
    image: p.gambar || "/warung.png",
    statusRaw: p.status,
  }));

  const pages = [1, 2, 3];
  const currentPage = 1;

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-0.5">Menu</h1>
          <p className="text-sm sm:text-base text-gray-600">Daftar menu makanan &amp; minuman</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <Calendar size={14} className="text-gray-600" />
            <span className="text-gray-700 font-medium text-xs sm:text-sm">22 Juli 2026</span>
          </div>
          <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
            <Bell size={15} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div className="relative w-full sm:w-[360px] lg:w-[420px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari menu..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F] text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border-2 border-[#558B2F] text-[#558B2F] rounded-xl font-bold hover:bg-green-50 transition text-sm">
            <span>Kategori</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-400 text-sm sm:text-base">Belum ada menu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <div className="relative h-32 sm:h-36 bg-gray-50 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${product.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
              <div className="p-2.5 sm:p-3">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-0.5 truncate">{product.name}</h3>
                <p className="text-gray-500 text-[11px] sm:text-xs mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">{product.price}</p>
                  <span
                    className={`font-semibold text-[11px] sm:text-xs ${
                      product.statusRaw === "tersedia" ? "text-[#558B2F]" : "text-red-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-50">
          <ChevronLeft size={16} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition ${
              currentPage === page
                ? "bg-[#558B2F] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
