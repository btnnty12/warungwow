import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pesanan")
      .select("status_pesanan");

    if (error) throw error;


    let completed = 0;
    let processing = 0;
    let cancelled = 0;


    data.forEach((item) => {

      switch (item.status_pesanan) {

        case "selesai":
          completed++;
          break;


        case "diterima_dapur":
        case "sedang_dibuat":
        case "sedang_diantar":
          processing++;
          break;


        case "dibatalkan":
          cancelled++;
          break;

      }

    });


    const total =
      completed +
      processing +
      cancelled;


    return NextResponse.json({

      completed: {
        jumlah: completed,
        persentase:
          total > 0
            ? Number(
                ((completed / total) * 100)
                .toFixed(1)
              )
            : 0
      },


      processing: {
        jumlah: processing,
        persentase:
          total > 0
            ? Number(
                ((processing / total) * 100)
                .toFixed(1)
              )
            : 0
      },


      cancelled: {
        jumlah: cancelled,
        persentase:
          total > 0
            ? Number(
                ((cancelled / total) * 100)
                .toFixed(1)
              )
            : 0
      },


      totalOrder: total

    });


  } catch (error: any) {

    return NextResponse.json(
      {
        message: error.message
      },
      {
        status: 500
      }
    );

  }
}