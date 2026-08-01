"use client";

type SalesChartProps = {
  chart: Array<{ jam: string; today: number; previousDay: number }>;
  todayTotal: number;
  previousDayTotal: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactAxis(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(abs >= 10_000_000_000 ? 0 : 1)}B`;
  }
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  }
  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`;
  }
  return `${Math.round(value)}`;
}

export default function SalesChart({ chart, todayTotal, previousDayTotal }: SalesChartProps) {
  const chartHours = chart.map((item) => item.jam);
  const salesData = chart.map((item) => item.today);
  const prevSalesData = chart.map((item) => item.previousDay);
  const maxValue = Math.max(...salesData, ...prevSalesData, 1);
  const visualMax = maxValue * 1.2;
  const sampledHours = chartHours.filter((_, idx) => idx % 3 === 0);

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">Sales Analytics</h3>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600 mt-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Hari ini
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-dashed border-gray-400" />
              Hari sebelumnya
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span>Hari ini: {formatCurrency(todayTotal)}</span>
          <span>Hari sebelumnya: {formatCurrency(previousDayTotal)}</span>
        </div>
      </div>

      <div className="relative h-44 sm:h-48">
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 pr-2">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
            <span key={ratio} className="text-[10px] text-gray-400 text-right w-7">
              {ratio === 0 ? "0" : formatCompactAxis(visualMax * ratio)}
            </span>
          ))}
        </div>

        <div className="ml-7 h-full relative">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 700 250"
            preserveAspectRatio="none"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 50 + 25}
                x2="700"
                y2={i * 50 + 25}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}

            <path
              d={`M 0 ${225 - (prevSalesData[0] / visualMax) * 200} ${prevSalesData
                .map(
                  (v, i) =>
                    `L ${(i / (prevSalesData.length - 1)) * 700} ${225 - (v / visualMax) * 200}`
                )
                .join(" ")}`}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d={`M 0 225 L 0 ${225 - (salesData[0] / visualMax) * 200} ${salesData
                .map(
                  (v, i) =>
                    `L ${(i / (salesData.length - 1)) * 700} ${225 - (v / visualMax) * 200}`
                )
                .join(" ")} L 700 225 Z`}
              fill="url(#salesGradient)"
            />

            <path
              d={`M 0 ${225 - (salesData[0] / visualMax) * 200} ${salesData
                .map(
                  (v, i) =>
                    `L ${(i / (salesData.length - 1)) * 700} ${225 - (v / visualMax) * 200}`
                )
                .join(" ")}`}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
            />

            {salesData.map((v, i) => (
              <circle
                key={i}
                cx={(i / (salesData.length - 1)) * 700}
                cy={225 - (v / visualMax) * 200}
                r="3.5"
                fill="white"
                stroke="#2563eb"
                strokeWidth="2.5"
              />
            ))}
          </svg>

          <div className="absolute bottom-[-18px] left-0 w-full flex justify-between">
            {sampledHours.map((hour, idx) => (
              <span key={`${hour}-${idx}`} className="text-[10px] text-gray-400">
                {hour}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
