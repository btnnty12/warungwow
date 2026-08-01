import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("detail_pesanan")
      .select(`
        jumlah,
        subtotal,
        produk (
          nama_produk
        ),
        pesanan (
          status_pesanan
        )
      `);

    if (error) throw error;


    const produkMap: Record<
      string,
      {
        jumlah: number;
        pendapatan: number;
      }
    > = {};


    data.forEach((item: any) => {

      // hanya hitung pesanan selesai
      if (
        item.pesanan?.status_pesanan !== "selesai"
      ) {
        return;
      }


      const namaProduk =
        item.produk?.nama_produk;


      if (!namaProduk) return;


      if (!produkMap[namaProduk]) {

        produkMap[namaProduk] = {
          jumlah: 0,
          pendapatan: 0,
        };

      }


      produkMap[namaProduk].jumlah +=
        item.jumlah;


      produkMap[namaProduk].pendapatan +=
        Number(item.subtotal);

    });


    const products = Object.entries(produkMap)
      .map(([nama, value]) => ({
        nama_produk: nama,
        jumlah_order: value.jumlah,
        total_penjualan: value.pendapatan,
      }))
      .sort(
        (a, b) =>
          b.jumlah_order - a.jumlah_order
      )
      .slice(0, 5);


    return NextResponse.json(products);


  } catch (error: any) {

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );

  }
}