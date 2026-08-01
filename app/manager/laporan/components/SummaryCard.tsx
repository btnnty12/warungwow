import { TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  change?: string;
  changeLabel?: string;
  positive?: boolean;
  subValue?: string;
  totalValue?: string;
};

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  iconBg,
  change,
  changeLabel,
  positive = true,
  subValue,
  totalValue,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center text-white shadow flex-shrink-0`}
        >
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-700 text-xs font-semibold mb-0.5">{title}</p>
          <p className="text-lg font-bold text-gray-800 truncate">{value}</p>
          {subValue && <p className="text-gray-600 text-[10px] mt-0.5">{subValue}</p>}
          {totalValue && (
            <p className="text-sm font-semibold text-gray-800 mt-1">{totalValue}</p>
          )}
          {change && (
            <div className="mt-1.5">
              <div className="flex items-center gap-1">
                <TrendingUp
                  size={12}
                  style={{ color: positive ? "#16a34a" : "#dc2626" }}
                />
                <span
                  className="text-xs font-bold"
                  style={{ color: positive ? "#16a34a" : "#dc2626" }}
                >
                  {change}
                </span>
              </div>
              <p className="text-gray-400 text-[10px] mt-0.5">{changeLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
