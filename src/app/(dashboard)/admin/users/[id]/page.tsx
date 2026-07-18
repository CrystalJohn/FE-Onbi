
'use client';

import { use, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Hash,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
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
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );

        if (res.ok) {
          const data: UserDetail = await res.json();
          setUser(data);
        } else {
          setError('Không thể tải thông tin người dùng');
        }
      } catch {
        setError('Không thể kết nối máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-sm text-rose-600">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Không tìm thấy người dùng
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Danh sách người dùng
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          Chi tiết người dùng
        </h1>

        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            isAdmin
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-blue-200 bg-blue-50 text-blue-700'
          }`}
        >
          {isAdmin ? 'Quản trị viên' : 'Phụ huynh'}
        </span>
      </div>

      <div className="max-w-lg space-y-4 rounded-[24px] border border-white/80 bg-white/75 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        <h2 className="text-base font-bold text-slate-950">
          Thông tin cơ bản
        </h2>

        <div className="space-y-3 text-sm">
          <InfoRow
            icon={Hash}
            label="ID"
            value={String(user.id)}
          />

          <InfoRow
            icon={User}
            label="Họ tên"
            value={user.fullName}
          />

          <InfoRow
            icon={Mail}
            label="Email"
            value={user.email}
          />

          <InfoRow
            icon={Phone}
            label="Số điện thoại"
            value={user.phone}
            empty="—"
          />

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-slate-400" />

            <span className="w-32 shrink-0 text-slate-500">
              Vai trò:
            </span>

            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                isAdmin
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : 'border-blue-200 bg-blue-50 text-blue-700'
              }`}
            >
              {isAdmin ? 'Quản trị viên' : 'Phụ huynh'}
            </span>
          </div>

          <InfoRow
            icon={Calendar}
            label="Ngày tạo tài khoản"
            value={new Intl.DateTimeFormat('vi-VN', {
              dateStyle: 'short',
              timeStyle: 'short',
            }).format(new Date(user.createdAt))}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  empty = '—',
}: {
  icon: typeof Hash;
  label: string;
  value?: string | null;
  empty?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />

      <span className="w-32 shrink-0 text-slate-500">
        {label}:
      </span>

      {value ? (
        <span className="break-all font-medium text-slate-900">
          {value}
        </span>
      ) : (
        <span className="italic text-slate-400">
          {empty}
        </span>
      )}
    </div>
  );
}
