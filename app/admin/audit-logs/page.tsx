"use client";
import { useEffect, useState } from "react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/audit-logs").then(r => r.json()).then(d => setLogs(d.data ?? []));
  }, []);

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity.toLowerCase().includes(search.toLowerCase()) ||
    l.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-950">Audit Logs</h1>
          <p className="text-sm text-indigo-400">{logs.length} total actions tracked</p>
        </div>
        <input
          placeholder="🔍  Search logs..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="border-2 border-indigo-100 bg-white rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:border-indigo-400 text-indigo-900 placeholder-indigo-300"
        />
      </div>

      <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-indigo-50 text-indigo-500 uppercase text-xs tracking-wide">
            <tr>
              {["Timestamp","User","Action","Entity","Details"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-indigo-300">No logs found.</td></tr>
            ) : filtered.map((l: any) => (
              <tr key={l.id} className="hover:bg-indigo-50/40 transition-colors">
                <td className="px-5 py-3.5 text-indigo-300 whitespace-nowrap text-xs">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-indigo-900">{l.user.name}</p>
                  <p className="text-xs text-indigo-400">{l.user.role}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold">
                    {l.action}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-indigo-600 font-medium">{l.entity}</td>
                <td className="px-5 py-3.5 text-indigo-400">{l.details ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
