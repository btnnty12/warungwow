import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log("Testing Supabase connection...");
console.log("URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    console.log("Fetching produk...");
    const { data: produk, error: produkError } = await supabase
      .from("produk")
      .select("*");
    
    if (produkError) {
      console.error("Error fetching produk:", produkError);
    } else {
      console.log("Produk data:", produk);
    }

    console.log("Fetching kategori...");
    const { data: kategori, error: kategoriError } = await supabase
      .from("kategori")
      .select("*");
    
    if (kategoriError) {
      console.error("Error fetching kategori:", kategoriError);
    } else {
      console.log("Kategori data:", kategori);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

test();
