"use client";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";

const STUDENT_STATUSES = ["ACCEPTED", "ATTENDED"];

export default function StudentDrivesPage() {
  const [drives, setDrives] = useState<any[]>([]);

  useEffect(() => { fetch("/api/student/drives").then(r => r.json()).then(d => setDrives(d.data ?? [])); }, []);

  async function updateStatus(assignmentId: string, status: string) {
    const res = await fetch("/api/student/drives", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: assignmentId, status }),
    });
    if (res.ok) setDrives(drives.map(d => d.id === assignmentId ? { ...d, status } : d));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">My Drives</h1>
      {drives.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">No drives assigned yet.</div>
      ) : (
        <div className="space-y-3">
          {drives.map((d: any) => (
            <div key={d.id} className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">{d.placementDrive.company.name}</p>
                <p className="text-sm text-gray-500">{d.placementDrive.company.role} · ₹{d.placementDrive.company.package} LPA</p>
                <p className="text-xs text-gray-400 mt-1">{d.placementDrive.venue} · {new Date(d.placementDrive.driveDate).toDateString()}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge status={d.status} />
                {d.status === "ASSIGNED" && (
                  <button onClick={() => updateStatus(d.id, "ACCEPTED")} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">Accept</button>
                )}
                {d.status === "ACCEPTED" && (
                  <button onClick={() => updateStatus(d.id, "ATTENDED")} className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">Mark Attended</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
