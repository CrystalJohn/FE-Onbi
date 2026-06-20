"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

type JwtPayload = {
  role?: "parent" | "admin";
  exp?: number;
};

function readPayload(token: string): JwtPayload | null {
  try {
    const encoded = token.split(".")[1];
    if (!encoded) return null;
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(normalized));
  } catch {
    return null;
  }
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = token ? readPayload(token) : null;
    const expired = payload?.exp ? payload.exp * 1000 <= Date.now() : false;
    const requiredRole = pathname.startsWith("/admin") ? "admin" : "parent";

    if (!token || !payload || expired) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    if (payload.role !== requiredRole) {
      router.replace(payload.role === "admin" ? "/admin/dashboard" : "/parent/dashboard");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-6" role="status">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          <ShieldCheck className="h-5 w-5 animate-pulse text-cyan-600" aria-hidden="true" />
          Đang xác thực phiên đăng nhập…
        </div>
      </div>
    );
  }

  return children;
}
