"use client";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";

const emptyDrive = { companyId: "", driveDate: "", venue: "", status: "UPCOMING" };

export default function AdminDrivesPage() {
  const [drives, setDrives] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [form, setForm] = useState(emptyDrive);
  const [showForm, setShowForm] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/drives").then(r => r.json()).then(d => setDrives(d.data ?? []));
    fetch("/api/admin/companies").then(r => r.json()).then(d => setCompanies(d.data ?? []));
    fetch("/api/admin/students").then(r => r.json()).then(d => setStudents(d.data ?? []));
  }, []);

  async function handleCreateDrive(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/drives", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const d = await res.json();
    if (res.ok) { setDrives(v => [d.data, ...v]); setForm(emptyDrive); setShowForm(false); setMsg("Drive created!"); }
    else setMsg(d.error ?? "Error");
  }

  async function handleAssign() {
    if (!assigning || !selectedStudent) return;
    const res = await fetch("/api/admin/assignments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentProfileId: selectedStudent, placementDriveId: assigning }),
    });
    const d = await res.json();
    setMsg(res.ok ? "Student assigned!" : d.error ?? "Error");
    setAssigning(null); setSelectedStudent("");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Placement Drives</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          {showForm ? "Cancel" : "+ New Drive"}
        </button>
      </div>
      {msg && <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">{msg}</div>}

      {showForm && (
        <form onSubmit={handleCreateDrive} className="bg-white rounded-xl shadow-sm p-5 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
            <select required value={form.companyId} onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Select company</option>
              {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Drive Date</label>
            <input type="datetime-local" required value={form.driveDate} onChange={e => setForm(f => ({ ...f, driveDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Venue</label>
            <input required value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {["UPCOMING","ONGOING","COMPLETED"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700">Create Drive</button>
          </div>
        </form>
      )}

      {assigning && (
        <div className="bg-white rounded-xl shadow-sm p-5 flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Assign Student</label>
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Select student</option>
              {students.filter(s => s.isVerified).map((s: any) => (
                <option key={s.id} value={s.id}>{s.user.name} — {s.department} (CGPA: {s.cgpa})</option>
              ))}
            </select>
          </div>
          <button onClick={handleAssign} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Assign</button>
          <button onClick={() => setAssigning(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
        </div>
      )}

      <div className="space-y-3">
        {drives.map((d: any) => (
          <div key={d.id} className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{d.company.name}</p>
              <p className="text-sm text-gray-500">{d.company.role} · ₹{d.company.package} LPA</p>
              <p className="text-xs text-gray-400 mt-1">{d.venue} · {new Date(d.driveDate).toDateString()} · {d._count?.assignments ?? 0} assigned</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge status={d.status} />
              <button onClick={() => { setAssigning(d.id); setMsg(""); }}
                className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200">
                Assign Student
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
