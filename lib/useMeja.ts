"use client";

import { useEffect, useState } from "react";

export function useMeja() {
  const [nomorMeja, setNomorMejaState] = useState<string>("A01");

  // Ambil data dari localStorage saat komponen mount
  useEffect(() => {
    const data = localStorage.getItem("nomorMeja");
    if (data) {
      setNomorMejaState(data);
    }
  }, []);

  const setNomorMeja = (nomor: string) => {
    setNomorMejaState(nomor);
    localStorage.setItem("nomorMeja", nomor);
  };

  return {
    nomorMeja,
    setNomorMeja,
  };
}
