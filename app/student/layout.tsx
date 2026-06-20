import StudentSidebar from "@/components/layouts/StudentSidebar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
