"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { CursorProvider, CursorFollow } from "@/components/animate-ui/components/animate/cursor";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng ký thất bại");
        return;
      }

      router.push(`/login?registered=true`);
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
              Đăng ký tài khoản
            </p>
            <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-sm">
              Tạo tài khoản để bắt đầu hành trình đồng hành cùng con
            </h2>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col justify-center p-8 md:w-1/2 lg:px-16 py-12">
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

          <h2 className="text-2xl font-bold text-slate-900">Tạo tài khoản</h2>
          <p className="mt-2 text-sm text-slate-500 mb-8 leading-relaxed">
            Đăng ký để bắt đầu trải nghiệm hệ sinh thái giáo dục của ONBI.
          </p>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10"
              />
            </div>

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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-bold text-slate-700"
              >
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901234567"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-bold text-slate-700"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10"
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-bold text-slate-700"
                >
                  Xác nhận
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/10"
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowConfirmPassword(true)}
                    onMouseUp={() => setShowConfirmPassword(false)}
                    onMouseLeave={() => setShowConfirmPassword(false)}
                    onTouchStart={() => setShowConfirmPassword(true)}
                    onTouchEnd={() => setShowConfirmPassword(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-[#4F46E5] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#4338ca] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/20"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-bold text-[#4F46E5] hover:text-[#4338ca] hover:underline"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
