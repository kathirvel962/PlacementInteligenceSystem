"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/analytics").then(r => r.json()).then(d => setStats(d.data));
  }, []);

  if (!stats) return <div className="text-gray-400 text-sm">Loading analytics...</div>;

  const highestPkg = stats.highestPackage != null ? `₹${stats.highestPackage} LPA` : "N/A";
  const avgPkg = stats.averagePackage != null ? `₹${stats.averagePackage} LPA` : "N/A";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} color="blue" />
        <StatCard title="Placed" value={stats.placedStudents} color="green" />
        <StatCard title="Unplaced" value={stats.unplacedStudents} color="red" />
        <StatCard title="Placement %" value={`${stats.placementPercentage}%`} color="purple" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Highest Package"
          value={highestPkg}
          subtitle={stats.highestPackage == null ? "No verified results yet" : undefined}
          color="green"
        />
        <StatCard
          title="Average Package"
          value={avgPkg}
          subtitle={stats.averagePackage == null ? "No verified results yet" : undefined}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Department-wise Statistics</h2>
          {stats.departmentStats.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.departmentStats.map((d: any) => {
                const pct = d.total > 0 ? Math.round((d.placed / d.total) * 100) : 0;
                return (
                  <div key={d.department}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{d.department}</span>
                      <span className="text-gray-500">{d.placed}/{d.total} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Company-wise Placements</h2>
          {stats.companyStats.length === 0 ? (
            <p className="text-sm text-gray-400">No placements verified yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.companyStats.map((c: any) => (
                <div key={c.company} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{c.company}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {c.count} placed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
