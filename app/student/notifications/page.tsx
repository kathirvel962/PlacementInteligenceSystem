"use client";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/student/notifications").then(r => r.json()).then(d => setNotifications(d.data ?? []));
  }, []);

  async function markAllRead() {
    await fetch("/api/student/notifications", { method: "PATCH" });
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
  }

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-950">Notifications</h1>
          <p className="text-sm text-indigo-400">{unread > 0 ? `${unread} unread` : "All caught up!"}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="text-xs px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 font-semibold rounded-xl">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-indigo-100 rounded-2xl p-10 text-center text-indigo-300">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-sm">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => (
            <div key={n.id} className={`bg-white rounded-2xl shadow-sm p-4 border-l-4 flex gap-4 ${
              n.isRead ? "border-indigo-100" : "border-indigo-500"}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                n.isRead ? "bg-gray-100 text-gray-400" : "bg-indigo-100 text-indigo-600"}`}>
                🔔
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${n.isRead ? "text-gray-600" : "text-indigo-900"}`}>{n.title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{n.message}</p>
                <p className="text-gray-300 text-xs mt-1.5">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
