import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function KeranjangPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F8]">

{/* ================= NAVBAR ================= */}
<nav className="w-full border-b border-gray-100 bg-white">
  <div className="max-w-6xl mx-auto h-24 flex items-center justify-between">

    {/* Kiri */}
    <div className="flex items-center">

      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Warung WOW"
          width={120}
          height={90}
          priority
        />
      </Link>

      {/* Tulisan Keranjang */}
      <h1 className="ml-20 text-3xl font-bold text-[#2F54EB]">
        Keranjang
      </h1>
    </div>

    {/* Tengah (Posisinya sama seperti Beranda & Menu) */}
    <div
      className="flex items-center gap-14"
      style={{ transform: "translateX(-450px)" }}
    >
      <Link
        href="/"
        className="font-semibold text-black hover:text-[#2F54EB]"
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

  </div>
</nav>

      {/* ================= ISI ================= */}
      <section className="max-w-6xl mx-auto flex gap-8 mt-10">

       {/* ================= LIST PRODUK ================= */}
<div className="w-[65%] mt-16">

  <div className="w-[94%] mx-auto bg-[#FF9500] rounded-3xl px-5 py-4 shadow-lg flex justify-between items-center">

    {/* Produk */}
    <div className="flex gap-5 items-center">

      {/* Gambar */}
      <div className="bg-white rounded-2xl p-3">
        <Image
          src="/products/energen.png"
          alt="Energen"
          width={90}
          height={90}
        />
      </div>

      {/* Informasi */}
      <div>
        <h2 className="text-2xl font-bold text-black">
          Energen
        </h2>

        <p className="text-white mt-1">
          Minuman
        </p>

        <p className="text-white text-xl font-bold mt-5">
          Rp25.000
        </p>
      </div>

    </div>

    {/* Jumlah */}
    <div className="flex flex-col items-center gap-4">
     <div className="flex items-center gap-5 bg-white border-2 border-[#2F54EB] ring-1 ring-black rounded-xl px-5 py-2">

        <button className="text-gray-500 text-2xl font-semibold hover:text-gray-700 transition">
          -
        </button>

        <span className="text-black text-xl font-bold">
          2
        </span>

        <button className="text-gray-500 text-2xl font-semibold hover:text-gray-700 transition">
          +
        </button>

      </div>
    </div>

{/* ================= TOTAL ================= */}
<div className="flex flex-col items-end justify-between h-[110px]">

  {/* Ikon Hapus */}
  <button className="self-end -mt-3 mr-1 hover:scale-110 transition">
    <Trash2
      size={22}
      strokeWidth={2.5}
      className="text-white"
    />
  </button>

  {/* Total */}
  <p className="text-2xl font-bold text-black">
    Rp 50.000
  </p>

</div>

  </div>

</div>

{/* ================= RINGKASAN ================= */}
<div className="w-[35%]">

  {/* Tombol No Meja */}
  <div className="flex justify-end mb-5">
    <button className="bg-[#2F54EB] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 transition">
      No Meja
    </button>
  </div>

  {/* Kotak Ringkasan */}
  <div className="bg-white rounded-3xl shadow-lg p-8">

    <h2 className="text-3xl font-bold mb-8 text-black">
      Ringkasan Pesanan
    </h2>

    <div className="flex justify-between mb-5 text-black">
      <span>Subtotal</span>
      <span>Rp74.000</span>
    </div>

    <div className="flex justify-between mb-5 text-black">
      <span>Pajak (10%)</span>
      <span>Rp15.000</span>
    </div>

    <div className="flex justify-between mb-8 text-black">
      <span>Biaya Layanan</span>
      <span>Rp3.000</span>
    </div>

    <hr />

    <div className="mt-8">
      <h3 className="text-xl font-bold text-black">
        Total Pembayaran
      </h3>

      <p className="text-4xl text-[#2F54EB] font-bold mt-2">
        Rp92.000
      </p>
    </div>

    <button className="w-full mt-8 bg-[#2F54EB] text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition">
      Pesan Sekarang
    </button>

    <Link href="/menu">
      <button className="w-full mt-4 border-2 border-[#2F54EB] text-[#2F54EB] py-4 rounded-2xl font-bold hover:bg-blue-50 transition">
        Lanjut Belanja
      </button>
    </Link>

  </div>

</div>

      </section>

    </main>
  );
}