"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

type ProductItem = {
  nama_produk: string;
  jumlah_order: number;
  total_penjualan: number;
};

type TopProductProps = {
  products: ProductItem[];
  focused?: boolean;
};

const DEFAULT_PREVIEW = 5;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TopProduct({ products, focused = false }: TopProductProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(focused);

  useEffect(() => {
    setExpanded(focused);
  }, [focused]);

  useEffect(() => {
    if (!focused) return;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focused]);

  const display = expanded ? products : products.slice(0, DEFAULT_PREVIEW);
  const hasMore = products.length > DEFAULT_PREVIEW;

  function handleBack() {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("view");
    const nextUrl = nextParams.toString()
      ? `${pathname}?${nextParams.toString()}`
      : pathname;
    router.push(nextUrl);
  }

  return (
    <div ref={sectionRef} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3 gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Top Selling Product
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {products.length} produk terjual
          </p>
        </div>
        <div className="flex items-center gap-2">
          {focused && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition text-xs sm:text-sm font-semibold"
            >
              <ArrowLeft size={14} />
              <span>Kembali</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/manager/pesanan")}
            className="text-blue-600 font-bold hover:text-blue-700 transition text-xs sm:text-sm whitespace-nowrap"
          >
            View All Orders
          </button>
        </div>
      </div>

      <div className="space-y-0.5 max-h-[420px] overflow-y-auto pr-1">
        {products.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400 italic">
              Belum ada data penjualan produk.
            </p>
          </div>
        ) : (
          display.map((product, index) => (
            <div
              key={`${product.nama_produk}-${index}`}
              className="flex items-center py-2 px-2 hover:bg-gray-50 rounded-lg transition border-b border-gray-50 last:border-b-0"
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 mr-2 ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : index === 1
                    ? "bg-gray-100 text-gray-700"
                    : index === 2
                    ? "bg-orange-50 text-orange-700"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">
                  {product.nama_produk}
                </p>
                <p className="text-gray-600 text-xs">
                  {product.jumlah_order} orders
                </p>
              </div>
              <p className="font-bold text-gray-800 text-xs ml-2 flex-shrink-0 tabular-nums">
                {formatCurrency(product.total_penjualan)}
              </p>
            </div>
          ))
        )}
      </div>

      {hasMore && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Menampilkan {display.length} dari {products.length} produk
          </p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2F54EB]/20 bg-[#2F54EB]/5 text-[#2F54EB] hover:bg-[#2F54EB]/10 transition text-xs sm:text-sm font-semibold"
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                <span>Sembunyikan</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                <span>View All ({products.length})</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
