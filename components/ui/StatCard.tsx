"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
  icon?: string;
}

const colorMap = {
  blue:   { card: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",   text: "text-blue-700",   icon: "bg-blue-200 text-blue-700" },
  green:  { card: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200", text: "text-emerald-700", icon: "bg-emerald-200 text-emerald-700" },
  yellow: { card: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200", text: "text-amber-700",   icon: "bg-amber-200 text-amber-700" },
  red:    { card: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200",    text: "text-rose-700",   icon: "bg-rose-200 text-rose-700" },
  purple: { card: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200", text: "text-purple-700", icon: "bg-purple-200 text-purple-700" },
  indigo: { card: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200", text: "text-indigo-700", icon: "bg-indigo-200 text-indigo-700" },
};

export default function StatCard({ title, value, subtitle, color = "indigo", icon }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`rounded-2xl border p-5 ${c.card} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${c.text} opacity-70`}>{title}</p>
          <p className={`text-3xl font-extrabold mt-1 ${c.text}`}>{value}</p>
          {subtitle && <p className={`text-xs mt-1.5 ${c.text} opacity-50`}>{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${c.icon}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
