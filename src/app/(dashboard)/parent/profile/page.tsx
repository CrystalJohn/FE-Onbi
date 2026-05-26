'use client'

import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Camera, Save, Lock } from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: string;
}

export default function ParentProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Change password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getToken = () => localStorage.getItem('token') || '';

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parents/profile`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setProfile(data);
        setFullName(data.fullName);
        setPhone(data.phone || '');
      } catch {
        setError('Không thể tải thông tin. Vui lòng đăng nhập lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parents/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ fullName, phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Cập nhật thất bại');
        return;
      }

      const updated = await res.json();
      setProfile(updated);
      setMessage('Cập nhật thành công!');
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setSaving(false);
    }
  };

  // Upload avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parents/avatar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const updated = await res.json();
      setProfile(updated);
      setMessage('Avatar đã cập nhật!');
    } catch {
      setError('Upload avatar thất bại');
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwMessage('');
    setPwError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parents/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setPwError(data.message || 'Đổi mật khẩu thất bại');
        return;
      }

      setPwMessage('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
    } catch {
      setPwError('Không thể kết nối server');
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Thông tin cá nhân</h1>

      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={profile?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=128'}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-cyan-600 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{profile?.fullName}</p>
          <p className="text-sm text-gray-500">{profile?.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">Role: {profile?.role}</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleUpdateProfile} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Save className="w-4 h-4" /> Chỉnh sửa thông tin
        </h2>

        {message && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">{message}</div>
        )}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và tên</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-all disabled:opacity-50"
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Đổi mật khẩu
        </h2>

        {pwMessage && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">{pwMessage}</div>
        )}
        {pwError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{pwError}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu hiện tại</label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onMouseDown={() => setShowOld(true)}
              onMouseUp={() => setShowOld(false)}
              onMouseLeave={() => setShowOld(false)}
              onTouchStart={() => setShowOld(true)}
              onTouchEnd={() => setShowOld(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onMouseDown={() => setShowNew(true)}
              onMouseUp={() => setShowNew(false)}
              onMouseLeave={() => setShowNew(false)}
              onTouchStart={() => setShowNew(true)}
              onTouchEnd={() => setShowNew(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={pwLoading}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all disabled:opacity-50"
        >
          {pwLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
}
