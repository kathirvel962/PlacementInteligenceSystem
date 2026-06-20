"use client";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { fetch("/api/admin/students").then(r => r.json()).then(d => setStudents(d.data ?? [])); }, []);

  async function toggleVerify(id: string, current: boolean) {
    const res = await fetch("/api/admin/students", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentProfileId: id, isVerified: !current }),
    });
    if (res.ok) setStudents(s => s.map(x => x.id === id ? { ...x, isVerified: !current } : x));
  }

  const filtered = students.filter(s =>
    s.user.name.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-950">Students</h1>
          <p className="text-sm text-indigo-400">{students.length} registered students</p>
        </div>
        <input
          placeholder="🔍  Search by name or department..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="border-2 border-indigo-100 bg-white rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:border-indigo-400 text-indigo-900 placeholder-indigo-300"
        />
      </div>

      <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-indigo-50 text-indigo-500 uppercase text-xs tracking-wide">
            <tr>
              {["Name","Email","Dept","CGPA","Backlogs","Status","Action"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-indigo-300">No students found.</td></tr>
            ) : filtered.map((s: any) => (
              <tr key={s.id} className="hover:bg-indigo-50/40 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-indigo-900">{s.user.name}</td>
                <td className="px-5 py-3.5 text-indigo-400">{s.user.email}</td>
                <td className="px-5 py-3.5 text-indigo-700">{s.department}</td>
                <td className="px-5 py-3.5">
                  <span className="font-bold text-indigo-800">{s.cgpa}</span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`font-bold ${s.backlogs > 0 ? "text-rose-500" : "text-emerald-500"}`}>{s.backlogs}</span>
                </td>
                <td className="px-5 py-3.5"><Badge status={s.isVerified ? "APPROVED" : "PENDING"} /></td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleVerify(s.id, s.isVerified)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${
                      s.isVerified
                        ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                        : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                    }`}>
                    {s.isVerified ? "Revoke" : "Verify"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
