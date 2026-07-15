"use client";
import { useRouter } from "next/navigation";

interface TopbarProps {
  name?: string;
  role?: string;
}

export default function Topbar({ name = "User", role = "ADMIN" }: TopbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/auth/login");
  }

  const isAdmin = role === "ADMIN";

  return (
    <div className="flex items-center justify-between bg-white border border-indigo-100 px-6 py-3.5 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow ${isAdmin ? "bg-gradient-to-br from-indigo-600 to-violet-600" : "bg-gradient-to-br from-blue-500 to-cyan-500"}`}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-bold text-indigo-950">Welcome, {name}</p>
          <p className="text-xs text-indigo-400">{isAdmin ? "Placement Officer · Admin" : "Student"}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-sm shadow-rose-200"
      >
        Logout
      </button>
    </div>
  );
}
