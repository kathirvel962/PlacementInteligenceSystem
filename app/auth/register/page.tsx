"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", cgpa: "", backlogs: "0", skills: "", certifications: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "STUDENT" }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Registration failed");
    router.refresh();
    router.push("/student/dashboard");
  }

  const fields = [
    { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
    { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
    { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
    { label: "Department", key: "department", type: "text", placeholder: "e.g. Computer Science" },
    { label: "CGPA", key: "cgpa", type: "number", placeholder: "e.g. 8.5" },
    { label: "Backlogs", key: "backlogs", type: "number", placeholder: "0" },
    { label: "Skills (comma separated)", key: "skills", type: "text", placeholder: "Python, React, SQL" },
    { label: "Certifications", key: "certifications", type: "text", placeholder: "AWS, Google Cloud..." },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-3 shadow-lg">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">CPMS</h1>
          <p className="text-indigo-200 text-xs mt-1">Campus Placement Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-indigo-950 mb-1">Create Student Account</h2>
          <p className="text-sm text-gray-400 mb-6">Fill in your academic details to register</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.key === "skills" || f.key === "certifications" ? "col-span-2" : ""}>
                <label className="block text-xs font-semibold text-indigo-900 mb-1.5 uppercase tracking-wide">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  required={["name","email","password","department","cgpa","skills"].includes(f.key)}
                  value={form[f.key as keyof typeof form]}
                  onChange={set(f.key)}
                  step={f.type === "number" ? "0.01" : undefined}
                  className="w-full border-2 border-indigo-100 bg-indigo-50/50 rounded-xl px-4 py-2.5 text-sm text-indigo-950 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            ))}
            <div className="col-span-2 mt-1">
              <button
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
