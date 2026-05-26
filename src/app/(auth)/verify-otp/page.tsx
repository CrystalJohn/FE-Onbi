'use client'

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';
  const mode = searchParams.get('mode') || 'register'; // 'register' | 'reset'
  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Mã OTP không hợp lệ');
        return;
      }

      if (mode === 'reset') {
        // For password reset: redirect to reset-password with email
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        // For registration: save token and go to dashboard
        localStorage.setItem('token', data.accessToken);
        router.push('/parent/children');
      }
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ONBI</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">AI Learning Companion</p>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Xác thực OTP</h2>
        <p className="text-sm text-slate-500 mb-6">
          {mode === 'reset'
            ? 'Nhập mã OTP đã gửi đến email để đặt lại mật khẩu'
            : 'Nhập mã OTP đã gửi đến email của bạn'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1.5">
              Mã OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              required
              maxLength={6}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-center placeholder:text-gray-400 tracking-[0.5em] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#22d3ee] hover:bg-cyan-400 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xác thực...' : 'Xác thực'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-slate-500 mt-6">
        <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-slate-500">Đang tải...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
