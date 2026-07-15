"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/student/dashboard",     label: "Dashboard" },
  { href: "/student/profile",       label: "My Profile" },
  { href: "/student/drives",        label: "My Drives" },
  { href: "/student/results",       label: "Results" },
  { href: "/student/notifications", label: "Notifications" },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/auth/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shadow-xl">
      <div className="px-6 py-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow">
            CP
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight">CPMS</h2>
            <p className="text-xs text-slate-400">Student Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(l => {
          const active = pathname === l.href;
          return (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-slate-900"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-slate-700">
        <button onClick={handleLogout}
          className="w-full px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-md"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
