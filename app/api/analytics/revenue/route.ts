import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pesanan")
      .select(`
        total_harga,
        metode_pembayaran,
        dibuat_pada,
        status_pesanan
      `)
      .eq("status_pesanan", "selesai")
      .order("dibuat_pada", {
        ascending: true
      });


    if (error) throw error;


    const report: Record<
      string,
      {
        totalSales: number;
        totalOrders: number;
        payment: Set<string>;
      }
    > = {};


    data.forEach((item: any) => {

      const tanggal =
        new Date(item.dibuat_pada)
          .toISOString()
          .split("T")[0];


      if (!report[tanggal]) {

        report[tanggal] = {
          totalSales: 0,
          totalOrders: 0,
          payment: new Set()
        };

      }


      report[tanggal].totalSales +=
        Number(item.total_harga);


      report[tanggal].totalOrders++;


      if(item.metode_pembayaran){
        report[tanggal]
          .payment
          .add(item.metode_pembayaran);
      }


    });



    const result =
      Object.entries(report)
      .map(([tanggal, value]) => ({

        tanggal,

        total_sales:
          value.totalSales,


        total_orders:
          value.totalOrders,


        avg_order_value:
          value.totalOrders > 0
          ?
          value.totalSales /
          value.totalOrders
          :
          0,


        payment_method:
          Array.from(
            value.payment
          ).join(", "),


        net_revenue:
          value.totalSales

      }));



    return NextResponse.json(result);


  } catch(error:any){

    return NextResponse.json(
      {
        message:error.message
      },
      {
        status:500
      }
    );

  }
}