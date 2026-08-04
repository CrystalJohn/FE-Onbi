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

// Cache verified tokens for the session — avoids an API call on every navigation
const verifiedTokens = new Set<string>();

// Đánh dấu token đã verify (gọi sau login/verify-otp thành công) để các lần
// vào khu dashboard sau đó mount luôn với ready=true, không nháy màn hình trắng.
export function markTokenVerified(token: string) {
  verifiedTokens.add(token);
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // Khởi tạo sẵn từ cache: token đã xác thực thì render luôn Dashboard,
  // tránh nháy màn hình loading (nền bg-slate-50) mỗi khi vào lại khu dashboard.
  const [ready, setReady] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    return token ? verifiedTokens.has(token) : false;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = token ? readPayload(token) : null;
    const expired = payload?.exp ? payload.exp * 1000 <= Date.now() : false;
    const requiredRole = pathname.startsWith("/admin") ? "admin" : "parent";

    // No token, bad payload, or expired → kick to login
    if (!token || !payload || expired) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      verifiedTokens.clear();
      router.replace("/login");
      return;
    }

    // Wrong role → redirect to their own dashboard
    if (payload.role !== requiredRole) {
      router.replace(payload.role === "admin" ? "/admin/dashboard" : "/parent/dashboard");
      return;
    }

    // Already verified this token in this session — skip the API call
    if (verifiedTokens.has(token)) {
      setReady(true);
      return;
    }

    // First visit: verify token signature with server to prevent forged JWTs
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
    const verifyEndpoint =
      requiredRole === "admin"
        ? `${apiUrl}/admin/dashboard`  // admin-only endpoint
        : `${apiUrl}/parents/profile`; // parent-only endpoint

    fetch(verifyEndpoint, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        verifiedTokens.add(token); // cache so subsequent navigations are instant
        setReady(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        verifiedTokens.clear();
        router.replace("/login");
      });
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
