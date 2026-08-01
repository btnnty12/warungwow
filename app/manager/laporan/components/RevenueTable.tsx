"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type RevenueRow = {
  tanggal: string;
  total_sales: number;
  total_orders: number;
  avg_order_value: number;
  payment_method: string;
  net_revenue: number;
};

type RevenueTableProps = {
  rows: RevenueRow[];
  focused?: boolean;
};

const DEFAULT_PREVIEW_ROWS = 5;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTanggal(tanggal: string) {
  try {
    const d = new Date(tanggal);
    if (Number.isNaN(d.getTime())) return tanggal;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return tanggal;
  }
}

export default function RevenueTable({ rows, focused = false }: RevenueTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(focused);

  useEffect(() => {
    setExpanded(focused);
  }, [focused]);

  const totalRows = rows.length;
  const displayRows = expanded ? rows : rows.slice(0, DEFAULT_PREVIEW_ROWS);
  const hasMore = totalRows > DEFAULT_PREVIEW_ROWS;

  function handleBack() {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("view");
    const nextUrl = nextParams.toString()
      ? `${pathname}?${nextParams.toString()}`
      : pathname;
    router.push(nextUrl);
  }

  const totalSales = rows.reduce((sum, r) => sum + Number(r.total_sales), 0);
  const totalOrders = rows.reduce((sum, r) => sum + Number(r.total_orders), 0);
  const totalNetRevenue = rows.reduce((sum, r) => sum + Number(r.net_revenue), 0);

  function handleExportExcel() {
    if (rows.length === 0) return;

    const exportRows = rows.map((r) => ({
      Tanggal: formatTanggal(r.tanggal),
      "Total Sales": formatCurrency(r.total_sales),
      "Total Orders": r.total_orders,
      "Avg Order Value": formatCurrency(r.avg_order_value),
      "Payment Method": r.payment_method || "-",
      "Net Revenue": formatCurrency(r.net_revenue),
    }));

    exportRows.push({
      Tanggal: "TOTAL",
      "Total Sales": formatCurrency(totalSales),
      "Total Orders": totalOrders,
      "Avg Order Value": formatCurrency(
        totalOrders > 0 ? totalSales / totalOrders : 0
      ),
      "Payment Method": "",
      "Net Revenue": formatCurrency(totalNetRevenue),
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet["!cols"] = [
      { wch: 14 },
      { wch: 18 },
      { wch: 14 },
      { wch: 18 },
      { wch: 20 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue");

    const tanggalExport = new Date()
      .toISOString()
      .split("T")[0]
      .replaceAll("-", "");
    XLSX.writeFile(workbook, `Revenue_Report_${tanggalExport}.xlsx`);
  }

  function handleExportPDF() {
    if (rows.length === 0) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Revenue Report - Warung WOW", pageWidth / 2, 40, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleString("id-ID")}`,
      pageWidth / 2,
      60,
      { align: "center" }
    );

    const body = rows.map((r) => [
      formatTanggal(r.tanggal),
      formatCurrency(r.total_sales),
      String(r.total_orders),
      formatCurrency(r.avg_order_value),
      r.payment_method || "-",
      formatCurrency(r.net_revenue),
    ]);

    body.push([
      "TOTAL",
      formatCurrency(totalSales),
      String(totalOrders),
      formatCurrency(totalOrders > 0 ? totalSales / totalOrders : 0),
      "",
      formatCurrency(totalNetRevenue),
    ]);

    autoTable(doc, {
      startY: 80,
      head: [
        [
          "Tanggal",
          "Total Sales",
          "Total Orders",
          "Avg Order",
          "Payment",
          "Net Revenue",
        ],
      ],
      body,
      headStyles: {
        fillColor: [47, 84, 235],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: { fontSize: 10, cellPadding: 6 },
      alternateRowStyles: { fillColor: [247, 247, 247] },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "center" },
        3: { halign: "right" },
        5: { halign: "right", fontStyle: "bold" },
      },
      didParseCell: (data) => {
        if (
          data.section === "body" &&
          data.row.index === body.length - 1
        ) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [230, 235, 255];
        }
      },
    });

    const tanggalExport = new Date()
      .toISOString()
      .split("T")[0]
      .replaceAll("-", "");
    doc.save(`Revenue_Report_${tanggalExport}.pdf`);
  }

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Revenue Table
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {totalRows} data transaksi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {focused && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition text-xs sm:text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              <span>Kembali</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 transition text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={16} />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 transition text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                Date
              </th>
              <th className="px-3 py-2 text-right font-semibold whitespace-nowrap">
                Total Sales
              </th>
              <th className="px-3 py-2 text-center font-semibold whitespace-nowrap">
                Total Orders
              </th>
              <th className="px-3 py-2 text-right font-semibold whitespace-nowrap">
                Avg Order
              </th>
              <th className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                Payment
              </th>
              <th className="px-3 py-2 text-right font-semibold whitespace-nowrap">
                Net Revenue
              </th>
            </tr>
          </thead>

          <tbody>
            {displayRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-gray-400 italic"
                >
                  Belum ada data transaksi.
                </td>
              </tr>
            ) : (
              displayRows.map((row, idx) => {
                const isLast = idx === displayRows.length - 1 && expanded;
                return (
                  <tr
                    key={row.tanggal}
                    className={`border-b border-gray-100 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    } ${isLast ? "last:border-b-0" : ""}`}
                  >
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {formatTanggal(row.tanggal)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 text-right tabular-nums">
                      {formatCurrency(row.total_sales)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 text-center tabular-nums">
                      {row.total_orders}
                    </td>
                    <td className="px-3 py-2 text-gray-700 text-right tabular-nums">
                      {formatCurrency(row.avg_order_value)}
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      {row.payment_method || "-"}
                    </td>
                    <td className="px-3 py-2 font-bold text-gray-800 text-right tabular-nums">
                      {formatCurrency(row.net_revenue)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {displayRows.length > 0 && (
            <tfoot>
              <tr className="bg-[#2F54EB]/10 font-bold">
                <td className="px-3 py-2 text-gray-800 whitespace-nowrap">
                  TOTAL
                </td>
                <td className="px-3 py-2 text-gray-800 text-right tabular-nums">
                  {formatCurrency(
                    displayRows.reduce(
                      (sum, r) => sum + Number(r.total_sales),
                      0
                    )
                  )}
                </td>
                <td className="px-3 py-2 text-gray-800 text-center tabular-nums">
                  {displayRows.reduce(
                    (sum, r) => sum + Number(r.total_orders),
                    0
                  )}
                </td>
                <td className="px-3 py-2 text-gray-800 text-right tabular-nums">
                  {formatCurrency(
                    (() => {
                      const s = displayRows.reduce(
                        (sum, r) => sum + Number(r.total_sales),
                        0
                      );
                      const o = displayRows.reduce(
                        (sum, r) => sum + Number(r.total_orders),
                        0
                      );
                      return o > 0 ? s / o : 0;
                    })()
                  )}
                </td>
                <td className="px-3 py-2 text-gray-500">-</td>
                <td className="px-3 py-2 text-gray-800 text-right tabular-nums">
                  {formatCurrency(
                    displayRows.reduce(
                      (sum, r) => sum + Number(r.net_revenue),
                      0
                    )
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {hasMore && (
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">
            Menampilkan {expanded ? totalRows : DEFAULT_PREVIEW_ROWS} dari{" "}
            {totalRows} baris data
          </p>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2F54EB]/20 bg-[#2F54EB]/5 text-[#2F54EB] hover:bg-[#2F54EB]/10 transition text-xs sm:text-sm font-semibold"
          >
            {expanded ? (
              <>
                <ChevronUp size={16} />
                <span>Tutup Laporan</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>View Full Report</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
