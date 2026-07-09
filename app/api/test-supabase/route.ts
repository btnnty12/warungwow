import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    console.log("Test API: Starting...");
    
    // Test 1: Try to fetch from produk
    const { data: produk, error: produkError } = await supabase.from("produk").select("*");
    console.log("Produk result:", { produk, produkError });
    
    // Test 2: Try to fetch from kategori
    const { data: kategori, error: kategoriError } = await supabase.from("kategori").select("*");
    console.log("Kategori result:", { kategori, kategoriError });
    
    // Test 3: Try to list all tables
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");
    console.log("Tables result:", { tables, tablesError });

    return NextResponse.json({
      success: true,
      produk,
      produkError,
      kategori,
      kategoriError,
      tables,
      tablesError,
    });
  } catch (error) {
    console.error("Test API: Unexpected error:", error);
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}
