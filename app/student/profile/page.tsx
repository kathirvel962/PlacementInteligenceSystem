"use client";
import { useEffect, useState } from "react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/student/profile").then(r => r.json()).then(d => {
      setProfile(d.data);
      setForm(d.data ?? {});
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/student/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setSaving(false);
    if (res.ok) { setProfile(d.data); setEditing(false); setMsg("Profile updated successfully!"); }
    else setMsg(d.error ?? "Error saving profile");
  }

  if (!profile) return (
    <div className="flex items-center gap-2 text-indigo-400 text-sm">
      <span className="animate-spin">⏳</span> Loading profile...
    </div>
  );

  const fields = [
    { key: "department", label: "Department", type: "text" },
    { key: "cgpa", label: "CGPA", type: "number" },
    { key: "backlogs", label: "Backlogs", type: "number" },
    { key: "skills", label: "Skills", type: "text" },
    { key: "certifications", label: "Certifications", type: "text" },
    { key: "resumeUrl", label: "Resume URL", type: "text" },
  ];

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-950">My Profile</h1>
          <p className="text-sm text-indigo-400">{profile.user?.email}</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${
            profile.isVerified
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-amber-50 border-amber-200 text-amber-600"}`}>
            {profile.isVerified ? "✅ Verified" : "⏳ Pending Verification"}
          </span>
          {!editing
            ? <button onClick={() => setEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm rounded-xl font-bold shadow-md shadow-indigo-200">
                Edit Profile
              </button>
            : <>
                <button onClick={handleSave} disabled={saving}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-xl font-bold disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-xl font-bold">
                  Cancel
                </button>
              </>
          }
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm rounded-xl flex items-center gap-2">
          <span>ℹ</span> {msg}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm p-6 grid grid-cols-2 gap-5">
        {fields.map(f => (
          <div key={f.key} className={f.key === "skills" || f.key === "certifications" || f.key === "resumeUrl" ? "col-span-2" : ""}>
            <label className="block text-xs font-semibold text-indigo-700 mb-1.5 uppercase tracking-wide">{f.label}</label>
            {editing ? (
              <input
                type={f.type}
                value={form[f.key] ?? ""}
                onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border-2 border-indigo-100 bg-indigo-50/50 rounded-xl px-4 py-2.5 text-sm text-indigo-950 focus:outline-none focus:border-indigo-400 focus:bg-white"
              />
            ) : (
              <p className="text-sm text-indigo-900 font-medium px-1">{profile?.[f.key] || <span className="text-indigo-300">—</span>}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
