"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import Topbar from "@/components/ui/Topbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingResults, setPendingResults] = useState(0);

  useEffect(() => {
    fetch("/api/admin/analytics").then(r => r.json()).then(d => setStats(d.data));
    fetch("/api/admin/results?status=PENDING").then(r => r.json()).then(d => setPendingResults(d.data?.length ?? 0));
  }, []);

  return (
    <div className="space-y-6">
      <Topbar name="Placement Officer" role="ADMIN" />

      <div>
        <h1 className="text-2xl font-extrabold text-indigo-950">Admin Dashboard</h1>
        <p className="text-sm text-indigo-400 mt-0.5">Campus Placement Management System</p>
      </div>

      {stats ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Students"  value={stats.totalStudents}           color="indigo" icon="🎓" />
            <StatCard title="Placed"          value={stats.placedStudents}          color="green"  icon="✅" />
            <StatCard title="Unplaced"        value={stats.unplacedStudents}        color="red"    icon="⏳" />
            <StatCard title="Placement %"     value={`${stats.placementPercentage}%`} color="purple" icon="📈" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard title="Highest Package" value={stats.highestPackage != null ? `₹${stats.highestPackage} LPA` : "N/A"} color="green"  icon="💰" />
            <StatCard title="Average Package" value={stats.averagePackage  != null ? `₹${stats.averagePackage} LPA`  : "N/A"} color="blue"   icon="📊" />
            <StatCard title="Pending Verifications" value={pendingResults} color="yellow" icon="🔍" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-indigo-900 mb-4">Department-wise Placements</h2>
              {stats.departmentStats.length === 0
                ? <p className="text-sm text-gray-400">No data yet.</p>
                : <div className="space-y-2">
                    {stats.departmentStats.map((d: any) => (
                      <div key={d.department} className="flex items-center justify-between text-sm">
                        <span className="text-indigo-900 font-medium">{d.department}</span>
                        <span className="text-indigo-400 text-xs">{d.placed}/{d.total}</span>
                      </div>
                    ))}
                  </div>
              }
            </div>
            <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-indigo-900 mb-4">Company-wise Placements</h2>
              {stats.companyStats.length === 0
                ? <p className="text-sm text-gray-400">No verified placements yet.</p>
                : <div className="space-y-2">
                    {stats.companyStats.map((c: any) => (
                      <div key={c.company} className="flex items-center justify-between text-sm">
                        <span className="text-indigo-900 font-medium">{c.company}</span>
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">{c.count} placed</span>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-indigo-400 text-sm">
          <span className="animate-spin">⏳</span> Loading analytics...
        </div>
      )}
    </div>
  );
}
