"use client";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";

export default function AdminResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [filter, setFilter] = useState("PENDING");
  const [note, setNote] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/admin/results?status=${filter}`).then(r => r.json()).then(d => setResults(d.data ?? []));
  }, [filter]);

  async function handleAction(id: string, status: "APPROVED" | "REJECTED") {
    const res = await fetch("/api/admin/results", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, adminNote: note[id] ?? "" }),
    });
    if (res.ok) setResults(r => r.filter(x => x.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Verify Results</h1>
      <div className="flex gap-2">
        {["PENDING","APPROVED","REJECTED"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-sm ${filter === s ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
            {s}
          </button>
        ))}
      </div>
      {results.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">No {filter.toLowerCase()} results.</div>
      ) : (
        <div className="space-y-3">
          {results.map((r: any) => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{r.studentProfile.user.name}</p>
                  <p className="text-sm text-gray-500">{r.assignment.placementDrive.company.name} · {r.packageOffered ? `₹${r.packageOffered} LPA` : "Package not specified"}</p>
                  <p className="text-xs text-gray-400">{r.studentProfile.user.email}</p>
                </div>
                <Badge status={r.status} />
              </div>
              <div className="flex gap-3 text-xs">
                {r.offerLetterUrl && <a href={r.offerLetterUrl} target="_blank" className="text-blue-600 hover:underline">Offer Letter</a>}
                {r.proofUrl && <a href={r.proofUrl} target="_blank" className="text-blue-600 hover:underline">Proof Doc</a>}
              </div>
              {filter === "PENDING" && (
                <div className="flex gap-3 items-center">
                  <input placeholder="Admin note (optional)" value={note[r.id] ?? ""} onChange={e => setNote(n => ({ ...n, [r.id]: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
                  <button onClick={() => handleAction(r.id, "APPROVED")} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700">Approve</button>
                  <button onClick={() => handleAction(r.id, "REJECTED")} className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
