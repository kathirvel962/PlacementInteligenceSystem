"use client";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";

export default function StudentResultsPage() {
  const [drives, setDrives] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [form, setForm] = useState({ assignmentId: "", offerLetterUrl: "", proofUrl: "", packageOffered: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/student/drives").then(r => r.json()).then(d => setDrives(d.data ?? []));
    fetch("/api/student/results").then(r => r.json()).then(d => setResults(d.data ?? []));
  }, []);

  const attendedDrives = drives.filter(d => d.status === "ATTENDED" || d.status === "SHORTLISTED");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/student/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (res.ok) { setMsg("Result submitted!"); fetch("/api/student/results").then(r => r.json()).then(d => setResults(d.data ?? [])); }
    else setMsg(d.error ?? "Error");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Placement Results</h1>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-700 mb-4">Submit Result</h2>
        {msg && <div className="mb-3 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={form.assignmentId} onChange={e => setForm(f => ({ ...f, assignmentId: e.target.value }))} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Select Drive</option>
            {attendedDrives.map((d: any) => (
              <option key={d.id} value={d.id}>{d.placementDrive.company.name} — {new Date(d.placementDrive.driveDate).toDateString()}</option>
            ))}
          </select>
          {[
            { key: "offerLetterUrl", label: "Offer Letter URL" },
            { key: "proofUrl", label: "Proof Document URL" },
            { key: "packageOffered", label: "Package Offered (LPA)" },
          ].map(f => (
            <input key={f.key} placeholder={f.label} value={form[f.key as keyof typeof form]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          ))}
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700">Submit</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-700 mb-4">My Results</h2>
        {results.length === 0 ? <p className="text-sm text-gray-400">No results submitted yet.</p> : (
          <div className="space-y-3">
            {results.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{r.assignment.placementDrive.company.name}</p>
                  {r.packageOffered && <p className="text-sm text-gray-500">₹{r.packageOffered} LPA</p>}
                  {r.adminNote && <p className="text-xs text-gray-400 mt-1">Note: {r.adminNote}</p>}
                </div>
                <Badge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
