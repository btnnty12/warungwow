"use client";

import { supabase } from "@/lib/supabase";

interface Props {
  pesananId: number;
}

export default function TombolSudahBayar({ pesananId }: Props) {

  const handleKlik = async () => {

    const { error } = await supabase
      .from("pesanan")
      .update({
        status_pembayaran: "berhasil",
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("id", pesananId);


    if (error) {
      console.error("Gagal update pembayaran:", error);
      alert(error.message);
      return;
    }


    const target = document.getElementById("status-pesanan");

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

  };


  return (
    <button
      onClick={handleKlik}
      className="w-full mt-6 h-12 rounded-xl bg-[#2F54EB] text-white font-bold text-base hover:bg-blue-700 transition"
    >
      Saya Sudah Bayar
    </button>
  );
}