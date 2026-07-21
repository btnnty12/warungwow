"use client";

import { ToastProvider } from "./komponen/Toast";
import { KeranjangIconProvider } from "./komponen/KeranjangIconContext";
import { KeranjangProvider } from "@/lib/useKeranjang";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KeranjangProvider>
      <KeranjangIconProvider>
        <ToastProvider>{children}</ToastProvider>
      </KeranjangIconProvider>
    </KeranjangProvider>
  );
}