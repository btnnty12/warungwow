import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    console.log("API Test: Memulai...");

    // Tes 1: Mencoba mengambil dari produk
    const { data: produk, error: errorProduk } = await supabase.from("produk").select("*");
    console.log("Hasil produk:", { produk, errorProduk });

    // Tes 2: Mencoba mengambil dari kategori
    const { data: kategori, error: errorKategori } = await supabase.from("kategori").select("*");
    console.log("Hasil kategori:", { kategori, errorKategori });

    // Tes 3: Mencoba mengambil semua tabel
    const { data: tabel, error: errorTabel } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");
    console.log("Hasil tabel:", { tabel, errorTabel });

    return NextResponse.json({
      berhasil: true,
      produk,
      errorProduk,
      kategori,
      errorKategori,
      tabel,
      errorTabel,
    });
  } catch (error) {
    console.error("API Test: Error tidak terduga:", error);
    return NextResponse.json({
      berhasil: false,
      error: String(error),
    });
  }
}
