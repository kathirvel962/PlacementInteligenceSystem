"use client";
import { useEffect, useState } from "react";

export default function AdminNotificationsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", message: "", sendToAll: true, userIds: [] as string[] });
  const [msg, setMsg] = useState("");

  useEffect(() => { fetch("/api/admin/students").then(r => r.json()).then(d => setStudents(d.data ?? [])); }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, message: form.message, userIds: form.sendToAll ? [] : form.userIds }),
    });
    const d = await res.json();
    if (res.ok) { setMsg(`Sent to ${d.sent} student(s).`); setForm({ title: "", message: "", sendToAll: true, userIds: [] }); }
    else setMsg(d.error ?? "Error");
  }

  function toggleStudent(userId: string) {
    setForm(f => ({
      ...f,
      userIds: f.userIds.includes(userId) ? f.userIds.filter(id => id !== userId) : [...f.userIds, userId],
    }));
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Send Notifications</h1>
      {msg && <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg">{msg}</div>}
      <form onSubmit={handleSend} className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="sendAll" checked={form.sendToAll} onChange={e => setForm(f => ({ ...f, sendToAll: e.target.checked }))} />
          <label htmlFor="sendAll" className="text-sm text-gray-700">Send to all students</label>
        </div>
        {!form.sendToAll && (
          <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
            {students.map((s: any) => (
              <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.userIds.includes(s.userId)} onChange={() => toggleStudent(s.userId)} />
                {s.user.name} — {s.department}
              </label>
            ))}
          </div>
        )}
        <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700">Send Notification</button>
      </form>
    </div>
  );
}
