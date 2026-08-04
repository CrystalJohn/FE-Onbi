'use client';

import { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { CursorProvider, CursorFollow } from '@/components/animate-ui/components/animate/cursor';
import { translateAuthError } from '@/lib/auth-errors';
import { api } from '@/lib/api';
import type { LoginResponse } from '@/types';

function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      let targetUrl = '/setup';
      if (data.user.role === 'admin') {
        targetUrl = '/admin/dashboard';
      } else {
        const { data: deviceData } = await api.get('/devices');

        const hasAssignedDevice = deviceData.some(
          (device: any) => device.assigned || device.assignedChildId
        );

        if (hasAssignedDevice) {
          targetUrl = '/parent/dashboard';
        }
      }

      setIsSuccess(true);
      setLoading(false);

      startTransition(() => {
        router.push(targetUrl);
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(translateAuthError(message, 'Email hoặc mật khẩu không đúng'));
      setLoading(false);
    }
  };

  const isNavigating = isPending || isSuccess;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isNavigating ? 0.6 : 1, y: isNavigating ? -4 : 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex w-full max-w-4xl flex-col md:flex-row bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden min-h-[640px]"
    >
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
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-200 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={`space-y-5 ${error ? 'animate-shake' : ''}`}>
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="you@example.com"
                required
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                  error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                    : 'border-slate-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]/10'
                }`}
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  required
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-10 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
                    error
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                      : 'border-slate-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]/10'
                  }`}
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
              disabled={loading || isSuccess}
              className={`mt-2 w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/20 ${
                isSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-600 cursor-default shadow-md'
                  : 'bg-[#4F46E5] hover:bg-[#4338ca] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-75'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="h-4 w-4 animate-bounce" />
                  <span>Đăng nhập thành công!</span>
                </>
              ) : loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="font-bold text-[#4F46E5] hover:text-[#4338ca] hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
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
