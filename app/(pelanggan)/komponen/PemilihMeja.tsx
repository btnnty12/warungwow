"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PemilihMejaProps = {
  initialMeja?: string;
};

export default function PemilihMeja({ initialMeja }: PemilihMejaProps) {
  const [nomorMeja, setNomorMeja] = useState<string>("");

  // Memuat dari initialMeja (searchParams) atau localStorage saat komponen dipasang
  useEffect(() => {
    if (initialMeja) {
      setNomorMeja(initialMeja);
      localStorage.setItem("nomorMeja", initialMeja);
    } else {
      const mejaTersimpan = localStorage.getItem("nomorMeja");
      if (mejaTersimpan) {
        setNomorMeja(mejaTersimpan);
      }
    }
  }, [initialMeja]);

  return (
    <div className="mt-8">
      <div className="bg-[#2F54EB] text-white rounded-full px-5 py-3 flex items-center gap-3 shadow w-fit">
        <Image
          src="/ikon meja putih.png"
          alt="Meja"
          width={40}
          height={40}
        />
        <span className="font-semibold">
          {nomorMeja ? `Meja ${nomorMeja}` : "Silakan scan QR meja"}
        </span>
      </div>
    </div>
  );
}
