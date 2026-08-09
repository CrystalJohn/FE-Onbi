import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {/* dash-root: móc CSS để phủ dark mode cho toàn khu dashboard (xem globals.css) */}
      {/* overflow-clip chứ không phải overflow-hidden: hidden biến thẻ này thành scroll
          container nên `sticky top-0` của sidebar bám vào nó (không bao giờ cuộn) thay vì
          bám viewport → sidebar trôi theo trang. clip vẫn cắt 2 quả bóng mờ bên dưới. */}
      <div className="dash-root relative flex min-h-dvh overflow-clip bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-500/10" />
        <div className="relative z-10 flex min-h-dvh w-full">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main id="main-content" className="flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pb-8 lg:px-8 lg:pt-5 xl:px-10">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
