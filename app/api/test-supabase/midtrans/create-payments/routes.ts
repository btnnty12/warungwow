import { NextResponse } from "next/server";
import * as Midtrans from "midtrans-client";

const SnapClient = (Midtrans as any).Snap ?? Midtrans;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { order_id, gross_amount } = body;

    const snap = new SnapClient({
      isProduction: false, // false = Sandbox
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },

      payment_type: "qris",

      qris: {
        acquirer: "gopay",
      },

      customer_details: {
        first_name: "Pelanggan Warung WOW",
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      success: true,
      data: transaction,
    });

  } catch (error) {
    console.error("Midtrans Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat transaksi Midtrans",
      },
      {
        status: 500,
      }
    );
  }
}