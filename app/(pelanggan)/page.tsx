import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // ================= AMBIL DATA DARI SUPABASE =================
  const [{ data: produk }, { data: kategori }, { data: meja }] =
    await Promise.all([
      supabase.from("produk").select("*"),
      supabase.from("kategori").select("*"),
      supabase.from("meja").select("*"),
    ]);

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
              className="font-semibold text-[#2F54EB] border-b-2 border-[#2F54EB] pb-1"
            >
              Beranda
            </Link>

            <Link
              href="/menu"
              className="font-semibold text-black hover:text-[#2F54EB]"
            >
              Menu
            </Link>
          </div>

          {/* Keranjang */}
          <Link
            href="/keranjang"
            className="relative flex items-center justify-center"
          >
            <Image
              src="/ikon/cart.png"
              alt="Keranjang"
              width={34}
              height={34}
            />
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold">
              2
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto mt-10">
        <div className="flex items-center justify-between">
          {/* Kiri */}
          <div className="w-1/2">
            <h1 className="text-[64px] font-extrabold text-[#2F54EB] leading-none">
              Warung WOW
            </h1>
            <p className="mt-8 text-[22px] font-semibold leading-9 text-black">
              Nikmati Beragam Produk Mayora
              <br />
              Favoritmu Di Warung WOW Terdekat!
            </p>
            <div className="flex gap-8 mt-12">
              <button className="bg-[#2F54EB] text-white px-6 py-3 rounded-xl font-semibold">
                Warung Terdekat
              </button>
              <Link href="/menu">
                <button className="border-2 border-[#2F54EB] text-[#2F54EB] px-6 py-3 rounded-xl font-semibold">
                  Lihat Menu
                </button>
              </Link>
            </div>
          </div>

          {/* Kanan */}
          <div className="w-1/2 flex justify-end">
            <Image
              src="/warung.png"
              alt="Warung"
              width={550}
              height={550}
            />
          </div>
        </div>
      </section>

      {/* ================= KATEGORI ================= */}
      <section className="max-w-5xl mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-5 text-black">
          Kategori Produk
        </h2>
        <div className="grid grid-cols-4 gap-8">
          {kategori?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-lg h-56 flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition"
            >
              <p className="font-bold text-xl mt-5 text-black">
                {item.nama_kategori}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BEST SELLER ================= */}
      <section className="max-w-5xl mx-auto mt-24">
        {/* Judul */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold text-black">
            Best Seller
          </h2>
          <Link href="/menu">
            <button className="text-[#2F54EB] font-semibold hover:underline">
              Lihat Semua
            </button>
          </Link>
        </div>

        {/* Card Produk */}
        <div className="grid grid-cols-4 gap-8">
          {produk?.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-lg p-5"
            >
              <div className="flex justify-center">
                {item.gambar ? (
                  <Image
                    src={item.gambar}
                    alt={item.nama_produk || "Produk"}
                    width={150}
                    height={150}
                  />
                ) : (
                  <div className="w-full h-[150px] flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mt-5">
                {item.nama_produk}
              </h3>
              <p className="text-[#2F54EB] font-semibold mt-2">
                Rp {Number(item.harga)?.toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
