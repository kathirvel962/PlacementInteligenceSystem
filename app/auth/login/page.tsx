"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Login failed");
    const dest = data.data.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";
    router.refresh();
    router.push(dest);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 shadow-lg">
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">CPMS</h1>
          <p className="text-indigo-200 text-sm mt-1">Campus Placement Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-indigo-950 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-indigo-900 mb-1.5 uppercase tracking-wide">Email Address</label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full border-2 border-indigo-100 bg-indigo-50/50 rounded-xl px-4 py-2.5 text-sm text-indigo-950 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-indigo-900 mb-1.5 uppercase tracking-wide">Password</label>
              <input
                type="password" required value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full border-2 border-indigo-100 bg-indigo-50/50 rounded-xl px-4 py-2.5 text-sm text-indigo-950 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            No account?{" "}
            <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-800 font-semibold">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
