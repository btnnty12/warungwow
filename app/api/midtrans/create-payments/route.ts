import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: Request) {
  try {
    const { pesanan_id } = await req.json();

    // Ambil data pesanan
    const { data: pesanan, error } = await supabase
      .from("pesanan")
      .select("*")
      .eq("id", pesanan_id)
      .single();

    if (error || !pesanan) {
      return NextResponse.json(
        {
          success: false,
          message: "Pesanan tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    // Cek apakah pembayaran sudah pernah dibuat
    const { data: pembayaran } = await supabase
      .from("pembayaran")
      .select("*")
      .eq("pesanan_id", pesanan.id)
      .maybeSingle();

    if (pembayaran) {
      return NextResponse.json({
        success: true,
        payment: pembayaran,
      });
    }

    // Charge Midtrans
    const chargeResponse = await core.charge({
      payment_type: "qris",

      transaction_details: {
        order_id: pesanan.kode_pesanan,
        gross_amount: Number(pesanan.total_harga),
      },

      customer_details: {
        first_name: pesanan.nama_pelanggan || "Pelanggan",
        phone: pesanan.no_hp || "",
      },
    });

    // Ambil URL QR
    const qrAction = chargeResponse.actions.find(
      (item) => item.name === "generate-qr-code"
    );

    // Expired 15 menit
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000);

    // Simpan pembayaran
    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .insert({
        pesanan_id: pesanan.id,
        order_id: chargeResponse.order_id,
        id_transaksi: chargeResponse.transaction_id,
        metode_pembayaran: "QRIS",
        jumlah_bayar: pesanan.total_harga,
        qr_url: qrAction?.url ?? null,
        status: chargeResponse.transaction_status,
        expired_at: expiredAt.toISOString(),
        dibuat_pada: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    return NextResponse.json({
      success: true,
      payment,
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message:
          err?.ApiResponse?.status_message ||
          err?.message ||
          "Gagal membuat transaksi",
      },
      { status: 500 }
    );
  }
}