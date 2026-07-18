"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { CursorProvider, CursorFollow } from "@/components/animate-ui/components/animate/cursor";

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Email hoặc mật khẩu không đúng");
        return;
      }

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Decode JWT to get role
      const payload = JSON.parse(atob(data.accessToken.split(".")[1]));

      if (payload.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        const [childrenRes, devicesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
            headers: { Authorization: `Bearer ${data.accessToken}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices`, {
            headers: { Authorization: `Bearer ${data.accessToken}` },
          }),
        ]);

        const childData = childrenRes.ok ? await childrenRes.json() : [];
        const deviceData = devicesRes.ok ? await devicesRes.json() : [];

        const hasAssignedDevice = deviceData.some(
          (device: any) => device.assigned || device.assignedChildId
        );

        if (hasAssignedDevice) {
          router.push("/parent/dashboard");
        } else {
          router.push("/setup");
        }
      }
    } catch {
      setError("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col md:flex-row bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden min-h-[640px]">
      {/* Left Panel - Image */}
      <div className="relative hidden w-1/2 p-2 md:block">
        <div className="relative h-full w-full overflow-hidden rounded-[24px]">
          <Image
            src="/Pomodoro Focus Cycle.webp"
            alt="ONBI Focus Background"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
          {/* Text overlay bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <p className="mb-2 text-sm font-medium text-white/80">
              Chào mừng bạn đến với ONBI
            </p>
            <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-sm">
              Nhìn con khôn lớn mỗi ngày, dù bạn ở bất cứ đâu
            </h2>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col justify-center p-8 md:w-1/2 lg:px-16 lg:py-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="mb-8 block transition-opacity hover:opacity-80 cursor-pointer">
            <CursorProvider>
              <CursorFollow side="bottom" align="center" className="text-xs whitespace-nowrap">Về trang chủ</CursorFollow>
            </CursorProvider>
             <div className="relative h-12 w-32 overflow-hidden rounded-lg">
                <Image
                  src="/logo_onbi.jpg"
                  alt="ONBI"
                  fill
                  sizes="128px"
                  className="object-contain object-left"
                />
             </div>
          </Link>

          <h2 className="text-2xl font-bold text-slate-900">Đăng nhập</h2>
          <p className="mt-2 text-sm text-slate-500 mb-8 leading-relaxed">
            Truy cập để bắt đầu theo dõi tiến độ và hoạt động của con bạn mọi lúc, mọi nơi.
          </p>

          {registered && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
              Đăng ký thành công! Vui lòng đăng nhập.
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-slate-700"
                >
                  Mật khẩu
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10"
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#4F46E5] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#4338ca] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/20"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-bold text-[#4F46E5] hover:text-[#4338ca] hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-sm text-slate-500">Đang tải...</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
