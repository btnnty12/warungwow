"use client";

import { ToastProvider } from "./komponen/Toast";
import { KeranjangIconProvider } from "./komponen/KeranjangIconContext";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KeranjangIconProvider>
      <ToastProvider>{children}</ToastProvider>
    </KeranjangIconProvider>
  );
}