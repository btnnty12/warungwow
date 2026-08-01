import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  total: number;
  subtitle: string;
  color: "blue" | "orange" | "green" | "red";
  icon: ReactNode;
};

const colorMap = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-500",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-500",
  },
};

export default function StatCard({
  title,
  total,
  subtitle,
  color,
  icon,
}: StatCardProps) {
  const style = colorMap[color];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">

        <div>
          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-black mt-2">
            {total}
          </h2>

          <p className="text-sm text-green-600 mt-3 font-medium">
            {subtitle}
          </p>
        </div>

        <div
          className={`
            w-14
            h-14
            rounded-xl
            flex
            items-center
            justify-center
            ${style.bg}
            ${style.text}
          `}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}