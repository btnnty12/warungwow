"use client";

import { ToastProvider } from "./komponen/Toast";
import { KeranjangIconProvider } from "./komponen/KeranjangIconContext";
import { KeranjangProvider } from "@/lib/useKeranjang";
import { RiwayatPesananProvider } from "@/lib/useRiwayatPesanan";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KeranjangProvider>
      <RiwayatPesananProvider>
        <KeranjangIconProvider>
          <ToastProvider>{children}</ToastProvider>
        </KeranjangIconProvider>
      </RiwayatPesananProvider>
    </KeranjangProvider>
  );
}