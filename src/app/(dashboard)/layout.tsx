import { AppSidebar } from "@/components/layouts/app-sidebar";
import { Header } from "@/components/layouts/header";
import { Main } from "@/components/layouts/main";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <TooltipProvider>
        <SidebarProvider>
          {/* dash-root: móc CSS để phủ dark mode cho toàn khu dashboard (xem globals.css) */}
          <div className="dash-root relative flex h-dvh w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-500/10" />
            <div className="relative z-10 flex h-dvh w-full">
              <AppSidebar />
              <div className="flex min-w-0 flex-1 flex-col overflow-hidden relative">
                <Header />
                <Main>{children}</Main>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ProtectedRoute>
  );
}
