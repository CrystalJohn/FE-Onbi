'use client'

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Mail, Phone, User, Calendar, ShieldCheck, Hash } from 'lucide-react';
import Link from 'next/link';

interface UserDetail {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  createdAt: string;
}

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
          { headers: { Authorization: `Bearer ${getToken()}` } },
        );
        if (res.ok) setUser(await res.json());
        else setError('Không thể tải thông tin user');
      } catch {
        setError('Không thể kết nối server');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="text-sm text-slate-500">Dang tai...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!user) return <div className="text-sm text-slate-500">Khong tim thay user</div>;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lai Users
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Chi tiet User</h1>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            user.role === 'admin'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}
        >
          {user.role === 'admin' ? 'Admin' : 'Parent'}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm max-w-lg">
        <h2 className="text-lg font-semibold text-slate-900">Thong tin co ban</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 w-28">ID:</span>
            <span className="font-medium text-slate-900">{user.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 w-28">Ho ten:</span>
            <span className="font-medium text-slate-900">{user.fullName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 w-28">Email:</span>
            <span className="font-medium text-slate-900">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 w-28">Phone:</span>
            <span className="font-medium text-slate-900">{user.phone || '—'}</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 w-28">Role:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                user.role === 'admin'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {user.role === 'admin' ? 'Admin' : 'Parent'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 w-28">Ngay tao:</span>
            <span className="font-medium text-slate-900">
              {new Date(user.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
