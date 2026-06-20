"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import Topbar from "@/components/ui/Topbar";

export default function StudentDashboard() {
  const [drives, setDrives] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/student/drives").then(r => r.json()).then(d => setDrives(d.data ?? []));
    fetch("/api/student/recommendations").then(r => r.json()).then(d => setRecommendations(d.data ?? []));
    fetch("/api/student/profile").then(r => r.json()).then(d => setProfile(d.data));
  }, []);

  const selected = drives.filter(d => d.status === "SELECTED").length;
  const pending  = drives.filter(d => d.status === "ASSIGNED" || d.status === "ACCEPTED").length;

  return (
    <div className="space-y-6">
      <Topbar name={profile?.user?.name ?? "Student"} role="STUDENT" />

      <div>
        <h1 className="text-2xl font-extrabold text-indigo-950">Student Dashboard</h1>
        <p className="text-sm text-indigo-400 mt-0.5">Your placement overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Drives Assigned" value={drives.length} color="indigo" icon="📅" />
        <StatCard title="Pending"         value={pending}       color="yellow"  icon="⏳" />
        <StatCard title="Selected"        value={selected}      color="green"   icon="🏆" />
        <StatCard title="CGPA"            value={profile?.cgpa ?? "-"} color="purple" icon="📚" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-indigo-900 mb-4">Recent Drive Assignments</h2>
          {drives.length === 0 ? (
            <div className="text-center py-6 text-indigo-300 text-sm">No drives assigned yet.</div>
          ) : (
            <ul className="space-y-3">
              {drives.slice(0, 5).map((d: any) => (
                <li key={d.id} className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl">
                  <div>
                    <p className="font-semibold text-indigo-900 text-sm">{d.placementDrive.company.name}</p>
                    <p className="text-indigo-400 text-xs mt-0.5">{new Date(d.placementDrive.driveDate).toDateString()}</p>
                  </div>
                  <Badge status={d.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-indigo-900 mb-4">Company Recommendations</h2>
          {recommendations.length === 0 ? (
            <div className="text-center py-6 text-indigo-300 text-sm">Complete your profile to get recommendations.</div>
          ) : (
            <ul className="space-y-3">
              {recommendations.slice(0, 5).map((r: any) => (
                <li key={r.company.id} className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl">
                  <div>
                    <p className="font-semibold text-indigo-900 text-sm">{r.company.name}</p>
                    <p className="text-indigo-400 text-xs mt-0.5">{r.company.role} · ₹{r.company.package} LPA</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    r.score >= 80 ? "bg-emerald-100 text-emerald-700" :
                    r.score >= 50 ? "bg-amber-100 text-amber-700" :
                    "bg-rose-100 text-rose-700"}`}>
                    {r.score}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
