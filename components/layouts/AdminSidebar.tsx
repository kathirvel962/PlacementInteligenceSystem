"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin/dashboard",    label: "Dashboard",       icon: "🏠" },
  { href: "/admin/students",     label: "Students",        icon: "🎓" },
  { href: "/admin/companies",    label: "Companies",       icon: "🏢" },
  { href: "/admin/drives",       label: "Placement Drives",icon: "📅" },
  { href: "/admin/results",      label: "Verify Results",  icon: "✅" },
  { href: "/admin/analytics",    label: "Analytics",       icon: "📊" },
  { href: "/admin/notifications",label: "Notifications",   icon: "🔔" },
  { href: "/admin/audit-logs",   label: "Audit Logs",      icon: "📋" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/auth/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-indigo-950 text-white flex flex-col shadow-xl">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-lg shadow">
            🎓
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight">CPMS</h2>
            <p className="text-xs text-indigo-400">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(l => {
          const active = pathname === l.href;
          return (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-900"
                  : "text-indigo-300 hover:bg-indigo-900 hover:text-white"
              }`}
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-5 border-t border-indigo-800">
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-md shadow-rose-900/30"
        >
          <span>⏻</span> Logout
        </button>
      </div>
    </aside>
  );
}
