import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("pesanan")
      .select(`
        total_harga,
        dibuat_pada,
        status_pesanan
      `)
      .eq("status_pesanan", "selesai");


    if (error) throw error;


    const today = new Date();

    const todayDate =
      today.toISOString()
        .split("T")[0];


    const yesterday =
      new Date(today);

    yesterday.setDate(
      today.getDate() - 1
    );


    const yesterdayDate =
      yesterday.toISOString()
      .split("T")[0];


    const hourlyToday: Record<number, number> = {};
    const hourlyYesterday: Record<number, number> = {};


    for (let i = 0; i < 24; i++) {
      hourlyToday[i] = 0;
      hourlyYesterday[i] = 0;
    }



    data.forEach((item: any) => {

      const date =
        new Date(item.dibuat_pada);


      const jam =
        date.getHours();


      const tanggal =
        date.toISOString()
        .split("T")[0];


      const harga =
        Number(item.total_harga);



      if (tanggal === todayDate) {

        hourlyToday[jam] += harga;

      }



      if (tanggal === yesterdayDate) {

        hourlyYesterday[jam] += harga;

      }


    });



    const chartData =
      Array.from(
        { length: 24 },
        (_, index) => ({

          jam:
            `${String(index)
              .padStart(2,"0")}:00`,

          today:
            hourlyToday[index],

          previousDay:
            hourlyYesterday[index]

        })
      );



    return NextResponse.json({
      
      todayTotal:
        Object.values(hourlyToday)
        .reduce(
          (a,b)=>a+b,
          0
        ),


      previousDayTotal:
        Object.values(hourlyYesterday)
        .reduce(
          (a,b)=>a+b,
          0
        ),


      chart:
        chartData

    });


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