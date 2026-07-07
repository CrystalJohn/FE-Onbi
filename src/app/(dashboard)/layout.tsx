import { Sidebar } from "@/components/layouts/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="relative flex min-h-dvh overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="relative z-10 flex min-h-dvh w-full">
          <Sidebar />
          <main id="main-content" className="flex min-w-0 flex-1 flex-col px-4 pb-28 pt-6 sm:px-6 sm:pb-8 lg:px-8 lg:pt-6 xl:px-10">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

