"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShieldCheck, ShoppingCart } from "lucide-react";
import { useKeranjang } from "@/lib/useKeranjang";
import KeranjangNavbar from "../komponen/KeranjangNavbar";

export default function KeranjangPage() {
  const router = useRouter();
  const {
    keranjang,
    totalHarga,
    tambahKeKeranjang,
    kurangiJumlah,
    hapusDariKeranjang,
    kosongkanKeranjang,
  } = useKeranjang();

  // Dummy data for testing if keranjang is empty
  const displayItems = keranjang.length > 0 ? keranjang : [];

  const pajak = totalHarga * 0.1;
  const biayaLayanan = 3000;
  const totalPembayaran = totalHarga + pajak + biayaLayanan;

  const handlePesanSekarang = () => {
    if (keranjang.length === 0) return;
    router.push("/pembayaran");
  };

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
            <h1 className="ml-20 text-3xl font-bold text-[#2F54EB]">Keranjang</h1>
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

          {/* Keranjang Icon */}
          <KeranjangNavbar />
        </div>
      </nav>

      {/* ================= ISI ================= */}
      <section className="max-w-6xl mx-auto flex gap-8 mt-10">
        {/* ================= LIST PRODUK ================= */}
        <div className="w-[65%] mt-16">
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingCart size={80} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Keranjang Anda kosong
              </h3>
              <Link
                href="/menu"
                className="text-[#2F54EB] font-semibold hover:underline"
              >
                Lihat Menu
              </Link>
            </div>
          ) : (
            displayItems.map((item) => {
              const subtotal =
                (typeof item.harga === "number"
                  ? item.harga
                  : Number(item.harga) || 0) * item.jumlah;

              return (
                <div
                  key={item.produk_id}
                  className="w-[94%] mx-auto bg-[#FF9500] rounded-3xl px-5 py-4 shadow-lg flex justify-between items-center mb-6"
                >
                  {/* Produk */}
                  <div className="flex gap-5 items-center">
                    {/* Gambar */}
                    <div className="bg-white rounded-2xl p-3">
                      {item.gambar ? (
                        <Image
                          src={item.gambar}
                          alt={item.nama_produk}
                          width={90}
                          height={90}
                          className="object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-[90px] h-[90px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                          <ShoppingCart size={40} />
                        </div>
                      )}
                    </div>

                    {/* Informasi */}
                    <div>
                      <h2 className="text-2xl font-bold text-black">
                        {item.nama_produk}
                      </h2>
                      <p className="text-white text-xl font-bold mt-5">
                        Rp{" "}
                        {(
                          typeof item.harga === "number"
                            ? item.harga
                            : Number(item.harga) || 0
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Jumlah */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-5 bg-white border-2 border-[#2F54EB] ring-1 ring-black rounded-xl px-5 py-2">
                      <button
                        onClick={() => kurangiJumlah(item.produk_id)}
                        className="text-gray-500 text-2xl font-semibold hover:text-gray-700 transition"
                      >
                        -
                      </button>
                      <span className="text-black text-xl font-bold">
                        {item.jumlah}
                      </span>
                      <button
                        onClick={() =>
                          tambahKeKeranjang({
                            ...item,
                            jumlah: 1,
                          })
                        }
                        className="text-gray-500 text-2xl font-semibold hover:text-gray-700 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ================= TOTAL ================= */}
                  <div className="flex flex-col items-end justify-between h-[110px]">
                    {/* Ikon Hapus */}
                    <button
                      onClick={() => hapusDariKeranjang(item.produk_id)}
                      className="self-end -mt-3 mr-1 hover:scale-110 transition"
                    >
                      <Trash2
                        size={22}
                        strokeWidth={2.5}
                        className="text-white"
                      />
                    </button>

                    {/* Total */}
                    <p className="text-2xl font-bold text-black">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ================= RINGKASAN ================= */}
        <div className="w-[35%]">
          {/* Tombol No Meja */}
          <div className="flex justify-end mb-5">
            <div className="bg-[#2F54EB] text-white px-6 py-3 rounded-full font-semibold shadow-md flex items-center gap-4">
              <ShoppingCart size={30} />
              <span>
                {typeof window !== "undefined"
                  ? localStorage.getItem("nomorMeja") || "No Meja"
                  : "No Meja"}
              </span>
            </div>
          </div>

          {/* Kotak Ringkasan */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-black">
              Ringkasan Pesanan
            </h2>

            <div className="flex justify-between mb-5 text-black">
              <span>Subtotal</span>
              <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between mb-5 text-black">
              <span>Pajak (10%)</span>
              <span>Rp {pajak.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between mb-8 text-black">
              <span>Biaya Layanan</span>
              <span>Rp {biayaLayanan.toLocaleString("id-ID")}</span>
            </div>

            <hr />

            {/* ================= CATATAN ================= */}
            <div className="mt-8">
              <label
                htmlFor="catatan"
                className="block text-base font-semibold text-black mb-3"
              >
                Catatan
              </label>
              <textarea
                id="catatan"
                rows={3}
                placeholder="Tambahkan catatan untuk pesanan Anda..."
                className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F54EB] focus:border-[#2F54EB]"
              />
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-black">Total Pembayaran</h3>
              <p className="text-3xl text-[#2F54EB] font-bold mt-2">
                Rp {totalPembayaran.toLocaleString("id-ID")}
              </p>
            </div>

            <button
              onClick={handlePesanSekarang}
              disabled={displayItems.length === 0}
              className={`w-full mt-8 py-4 rounded-2xl font-bold transition ${
                displayItems.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#2F54EB] text-white hover:bg-blue-700"
              }`}
            >
              Pesan Sekarang
            </button>

            {/* Transaksi Aman */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <ShieldCheck
                size={18}
                strokeWidth={2}
                style={{ color: "#22C55E" }}
              />
              <span className="text-sm font-medium text-black">
                Transaksi aman & terpercaya
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
