import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Kategori, Produk } from "@/lib/types";
import PemilihMeja from "../komponen/PemilihMeja";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ meja?: string }>;
}) {
  const params = await searchParams;
  const initialMeja = params.meja || "A01"; // Temporary default for testing

  // ================= AMBIL DATA DARI SUPABASE =================
  const [
    { data: produk, error: errorProduk },
    { data: kategori, error: errorKategori },
  ] = await Promise.all([
    supabase.from("produk").select("*"),
    supabase.from("kategori").select("*"),
  ]);

  if (errorProduk) {
    console.error("Error mengambil produk:", errorProduk);
  }
  if (errorKategori) {
    console.error("Error mengambil kategori:", errorKategori);
  }

  console.log("Data produk:", produk);
  console.log("Data kategori:", kategori);

  return (
    <main className="min-h-screen bg-white">
      {/* ================= NAVBAR ================= */}
      <nav className="w-full border-b border-gray-100">
        <div className="max-w-6xl mx-auto h-24 flex items-center justify-between">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Warung WOW"
            width={120}
            height={90}
            priority
          />

          {/* Menu */}
          <div className="flex items-center gap-14">
            <Link
              href="/"
              className="font-semibold text-black hover:text-[#2F54EB]"
            >
              Beranda
            </Link>

            <Link
              href="/menu"
              className="font-semibold text-[#2F54EB] border-b-2 border-[#2F54EB] pb-1"
            >
              Menu
            </Link>
          </div>

          {/* Keranjang */}
          <Link
            href="/keranjang"
            className="relative flex items-center justify-center"
          >
            <ShoppingCart size={34} className="text-black" />
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold">
              2
            </span>
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-10 pb-16">
        <div className="pt-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari makanan, minuman, atau produk Mayora..."
              className="w-full h-14 rounded-full border border-gray-400 placeholder:text-gray-300 shadow-sm pl-14 pr-6 outline-none focus:border-2 focus:border-[#2F54EB]"
            />
            <Search
              size={22}
              className="absolute left-5 top-1/2 -translate-y-1/2 opacity-50 text-black"
            />
          </div>
        </div>

        <PemilihMeja initialMeja={initialMeja} />

        <div className="flex gap-5 mt-7 flex-wrap">
          {kategori?.map((item) => (
            <button
              key={item.id}
              className="rounded-full px-7 py-3 font-semibold shadow transition bg-white text-black hover:bg-gray-50"
            >
              {item.nama_kategori}
            </button>
          ))}
        </div>

        {/* ================= BEST SELLER ================= */}
        <section className="mt-12">
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] font-bold text-black">Best Seller</h2>
            <button className="flex items-center gap-2 text-[#2F54EB] font-semibold hover:underline">
              Lihat Semua
              <span>›</span>
            </button>
          </div>

          <div className="grid grid-cols-6 gap-8 mt-8">
            {produk?.slice(0, 6).map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                {/* Gambar */}
                <div className="relative w-full h-[145px] bg-[#F6F6F6]">
                  {item.gambar ? (
                    <Image
                      src={item.gambar}
                      alt={item.nama_produk || "Produk"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Tanpa Gambar
                    </div>
                  )}
                </div>

                {/* Isi */}
                <div className="p-3">
                  <h3 className="text-[16px] font-semibold text-black truncate">
                    {item.nama_produk}
                  </h3>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-[#2F54EB] font-bold text-sm">
                      Rp {Number(item.harga)?.toLocaleString("id-ID")}
                    </p>
                    <button className="w-7 h-7 rounded-full bg-[#2F54EB] text-white flex items-center justify-center hover:bg-blue-700">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= MENU ================= */}
        <section className="mt-16">
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] font-bold text-black">Menu</h2>
            <button className="flex items-center gap-2 text-[#2F54EB] font-semibold hover:underline">
              Lihat Semua
              <span>›</span>
            </button>
          </div>

          <div className="grid grid-cols-6 gap-8 mt-8">
            {produk?.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                {/* Gambar */}
                <div className="relative w-full h-[145px] bg-[#F6F6F6]">
                  {item.gambar ? (
                    <Image
                      src={item.gambar}
                      alt={item.nama_produk || "Produk"}
                      fill
                      className="object-contain p-3"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Tanpa Gambar
                    </div>
                  )}
                </div>

                {/* Isi Card */}
                <div className="p-3">
                  <h3 className="text-[16px] font-semibold text-black truncate">
                    {item.nama_produk}
                  </h3>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-[#2F54EB] font-bold">
                      Rp {Number(item.harga)?.toLocaleString("id-ID")}
                    </p>
                    <button className="w-8 h-8 rounded-full bg-[#2F54EB] text-white font-bold hover:bg-blue-700 transition">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
