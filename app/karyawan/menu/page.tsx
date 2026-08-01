"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Bell,
  BookOpen,
} from "lucide-react";

export default function KaryawanMenuPage() {
  const [produk, setProduk] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cari, setCari] = useState("");

  async function ambilData() {
    setLoading(true);
    const [{ data: p, error: ep }] = await Promise.all([
      supabase
        .from("produk")
        .select(
          `
          *,
          kategori:kategori_id (
            nama_kategori
          )
        `
        )
        .order("id", { ascending: false }),
    ]);
    if (ep) console.error("Error fetch produk:", ep);
    setProduk((p as any[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    ambilData();
  }, []);

  const products = useMemo(() => {
    return (produk || []).map((p) => ({
      id: p.id,
      name: p.nama_produk || "Produk",
      category: (p as any).kategori?.nama_kategori || "Umum",
      price: p.harga
        ? `Rp ${Number(p.harga).toLocaleString("id-ID")}`
        : "Rp 0",
      status: p.status === "tersedia" ? "Tersedia" : "Habis",
      image: p.gambar || "/warung.png",
      statusRaw: p.status,
    }));
  }, [produk]);

  const terfilter = useMemo(() => {
    const q = cari.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, cari]);

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-0.5 flex items-center gap-2">
            <BookOpen className="text-[#558B2F]" size={24} /> Menu
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Daftar menu makanan &amp; minuman
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <Calendar size={14} className="text-gray-600" />
            <span className="text-gray-700 font-medium text-xs sm:text-sm">
              {new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
            <Bell size={15} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div className="relative w-full sm:w-[360px] lg:w-[420px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari menu..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F] text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* Loading / Empty / Product Grid */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[#558B2F]/30 border-t-[#558B2F] rounded-full animate-spin mb-2" />
          <p className="text-gray-400 text-sm sm:text-base">Memuat menu...</p>
        </div>
      ) : terfilter.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm font-semibold mb-1">
            {cari ? "Tidak ada menu yang sesuai." : "Belum ada menu."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {terfilter.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
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
                <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-0.5 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-[11px] sm:text-xs mb-2">
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">
                    {product.price}
                  </p>
                  <span
                    className={`font-semibold text-[11px] sm:text-xs ${
                      product.statusRaw === "tersedia"
                        ? "text-[#558B2F]"
                        : "text-red-500"
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
    </div>
  );
}
