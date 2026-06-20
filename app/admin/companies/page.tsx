"use client";
import { useEffect, useState } from "react";

const emptyForm = { name: "", role: "", package: "", minCgpa: "", allowedBacklogs: "0", requiredSkills: "" };

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetch("/api/admin/companies").then(r => r.json()).then(d => setCompanies(d.data ?? [])); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (res.ok) { setCompanies(c => [d.data, ...c]); setForm(emptyForm); setShowForm(false); setMsg("Company added successfully!"); }
    else setMsg(d.error ?? "Error");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-950">Companies</h1>
          <p className="text-sm text-indigo-400">{companies.length} companies registered</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-200">
          {showForm ? "✕ Cancel" : "+ Add Company"}
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
          <span>✅</span> {msg}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-indigo-100 rounded-2xl shadow-sm p-6 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-bold text-indigo-900 mb-1">New Company Details</h3>
          {[["name","Company Name"],["role","Role / Position"],["package","Package (LPA)"],["minCgpa","Minimum CGPA"],["allowedBacklogs","Allowed Backlogs"],["requiredSkills","Required Skills (comma separated)"]].map(([k, l]) => (
            <div key={k} className={k === "requiredSkills" ? "col-span-2" : ""}>
              <label className="block text-xs font-semibold text-indigo-700 mb-1.5 uppercase tracking-wide">{l}</label>
              <input
                required={["name","role","package"].includes(k)}
                value={form[k as keyof typeof form]} onChange={set(k)}
                className="w-full border-2 border-indigo-100 bg-indigo-50/50 rounded-xl px-4 py-2.5 text-sm text-indigo-950 focus:outline-none focus:border-indigo-400 focus:bg-white"
              />
            </div>
          ))}
          <div className="col-span-2">
            <button type="submit"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md">
              Add Company
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-indigo-50 text-indigo-500 uppercase text-xs tracking-wide">
            <tr>
              {["Company","Role","Package","Min CGPA","Backlogs","Required Skills"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {companies.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-indigo-300">No companies added yet.</td></tr>
            ) : companies.map((c: any) => (
              <tr key={c.id} className="hover:bg-indigo-50/40 transition-colors">
                <td className="px-5 py-3.5 font-bold text-indigo-900">{c.name}</td>
                <td className="px-5 py-3.5 text-indigo-600">{c.role}</td>
                <td className="px-5 py-3.5"><span className="font-bold text-emerald-600">₹{c.package} LPA</span></td>
                <td className="px-5 py-3.5 text-indigo-700">{c.minCgpa}</td>
                <td className="px-5 py-3.5 text-center text-indigo-700">{c.allowedBacklogs}</td>
                <td className="px-5 py-3.5 text-indigo-400 truncate max-w-xs">{c.requiredSkills}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
