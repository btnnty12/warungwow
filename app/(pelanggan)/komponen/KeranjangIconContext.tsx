"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

type KeranjangIconContextType = {
  keranjangIconRef: React.RefObject<HTMLDivElement | null>;
};

const KeranjangIconContext = createContext<KeranjangIconContextType | undefined>(undefined);

export function KeranjangIconProvider({ children }: { children: ReactNode }) {
  const keranjangIconRef = useRef<HTMLDivElement | null>(null);

  return (
    <KeranjangIconContext.Provider value={{ keranjangIconRef }}>
      {children}
    </KeranjangIconContext.Provider>
  );
}

export function useKeranjangIcon() {
  const context = useContext(KeranjangIconContext);
  if (!context) {
    throw new Error("useKeranjangIcon must be used within a KeranjangIconProvider");
  }
  return context;
}
