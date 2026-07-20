import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PemilihMeja from "../komponen/PemilihMeja";
import ProdukList from "../komponen/ProdukList";
import KeranjangNavbar from "../komponen/KeranjangNavbar";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ meja?: string }>;
}) {
  const params = await searchParams;
  const initialMeja = params.meja || "A01";

  // Ambil data dari Supabase di server
  const [
    { data: produk, error: errorProduk },
    { data: kategori, error: errorKategori },
  ] = await Promise.all([
    supabase.from("produk").select("*"),
    supabase.from("kategori").select("*"),
  ]);

  if (errorProduk) console.error("Error produk:", errorProduk);
  if (errorKategori) console.error("Error kategori:", errorKategori);

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="w-full border-b border-gray-100">
        <div className="max-w-6xl mx-auto h-24 flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="Warung WOW"
            width={120}
            height={90}
            priority
          />
          <div className="flex items-center gap-14">
            <Link href="/" className="font-semibold text-black hover:text-[#2F54EB]">
              Beranda
            </Link>
            <Link
              href="/menu"
              className="font-semibold text-[#2F54EB] border-b-2 border-[#2F54EB] pb-1"
            >
              Menu
            </Link>
          </div>
          <KeranjangNavbar />
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-10 pb-16">
        <PemilihMeja initialMeja={initialMeja} />
        {produk && kategori ? (
          <ProdukList produk={produk} kategori={kategori} />
        ) : null}
      </section>
    </main>
  );
}
