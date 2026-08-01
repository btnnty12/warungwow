import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Total sales & total order
    const { data: pesanan, error: pesananError } = await supabase
      .from("pesanan")
      .select("id, total_harga")
      .eq("status_pesanan", "selesai");

    if (pesananError) throw pesananError;


    const totalOrder = pesanan.length;

    const totalSales = pesanan.reduce(
      (total, item) => total + Number(item.total_harga),
      0
    );

    const avgOrderValue =
      totalOrder > 0 ? totalSales / totalOrder : 0;


    // Top Product
    const { data: detail, error: detailError } = await supabase
      .from("detail_pesanan")
      .select(`
        jumlah,
        produk (
          nama_produk,
          harga
        ),
        pesanan (
          status_pesanan
        )
      `);

    if (detailError) throw detailError;


    const produkMap: Record<
      string,
      {
        jumlah: number;
        pendapatan: number;
      }
    > = {};


    detail.forEach((item: any) => {

      if (
        item.pesanan?.status_pesanan !== "selesai"
      ) return;


      const nama = item.produk.nama_produk;

      if (!produkMap[nama]) {
        produkMap[nama] = {
          jumlah: 0,
          pendapatan: 0,
        };
      }


      produkMap[nama].jumlah += item.jumlah;

      produkMap[nama].pendapatan +=
        item.jumlah * item.produk.harga;

    });


    const topProduct = Object.entries(produkMap)
      .sort(
        (a, b) =>
          b[1].jumlah - a[1].jumlah
      )[0];


    return NextResponse.json({
      totalSales,
      totalOrder,
      avgOrderValue,

      topProduct: topProduct
        ? {
            nama: topProduct[0],
            jumlahOrder: topProduct[1].jumlah,
            pendapatan: topProduct[1].pendapatan,
          }
        : null,
    });


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