"use client";

const variants: Record<string, { bg: string; dot: string }> = {
  ASSIGNED:    { bg: "bg-blue-100 text-blue-700 border border-blue-200",       dot: "bg-blue-500" },
  ACCEPTED:    { bg: "bg-cyan-100 text-cyan-700 border border-cyan-200",        dot: "bg-cyan-500" },
  ATTENDED:    { bg: "bg-amber-100 text-amber-700 border border-amber-200",     dot: "bg-amber-500" },
  SHORTLISTED: { bg: "bg-orange-100 text-orange-700 border border-orange-200",  dot: "bg-orange-500" },
  SELECTED:    { bg: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  REJECTED:    { bg: "bg-rose-100 text-rose-700 border border-rose-200",        dot: "bg-rose-500" },
  PENDING:     { bg: "bg-amber-100 text-amber-700 border border-amber-200",     dot: "bg-amber-500" },
  APPROVED:    { bg: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  UPCOMING:    { bg: "bg-indigo-100 text-indigo-700 border border-indigo-200",  dot: "bg-indigo-500" },
  ONGOING:     { bg: "bg-violet-100 text-violet-700 border border-violet-200",  dot: "bg-violet-500" },
  COMPLETED:   { bg: "bg-gray-100 text-gray-600 border border-gray-200",        dot: "bg-gray-400" },
};

export default function Badge({ status }: { status: string }) {
  const v = variants[status] ?? { bg: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${v.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
      {status}
    </span>
  );
}
