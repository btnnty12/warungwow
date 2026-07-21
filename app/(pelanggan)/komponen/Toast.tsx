"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle } from "lucide-react";
import FlyingProduct from "./FlyingProduct";

type Toast = {
  id: number;
  message: string;
};

type FlyingProductState = {
  id: number;
  imageUrl: string | null;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
} | null;

type ToastContextType = {
  showToast: (message: string) => void;
  triggerFlyingAnimation: (
    imageUrl: string | null,
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number }
  ) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [flyingProduct, setFlyingProduct] = useState<FlyingProductState>(null);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const triggerFlyingAnimation = useCallback(
    (imageUrl: string | null, startPosition: { x: number; y: number }, endPosition: { x: number; y: number }) => {
      const id = Date.now();
      setFlyingProduct({ id, imageUrl, startPosition, endPosition });
    },
    []
  );

  const handleFlyingComplete = useCallback(() => {
    setFlyingProduct(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, triggerFlyingAnimation }}>
      {children}
      {flyingProduct && (
        <FlyingProduct
          key={flyingProduct.id}
          imageUrl={flyingProduct.imageUrl}
          startPosition={flyingProduct.startPosition}
          endPosition={flyingProduct.endPosition}
          onComplete={handleFlyingComplete}
        />
      )}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-slide-up"
          >
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-sm font-medium text-gray-800">{toast.message}</span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
