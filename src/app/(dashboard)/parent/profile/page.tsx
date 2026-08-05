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

  // Selected avatar state to hold file before saving
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

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

  // Handle avatar file selection
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(objectUrl);
  };

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      // 1. Update text info first
      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parents/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ fullName, phone }),
      });

      if (!profileRes.ok) {
        const data = await profileRes.json();
        setError(data.message || 'Cập nhật thông tin thất bại');
        setSaving(false);
        return;
      }
      
      let updatedProfile = await profileRes.json();

      // 2. Upload avatar if selected
      if (selectedAvatarFile) {
        const formData = new FormData();
        formData.append('file', selectedAvatarFile);

        const avatarRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parents/avatar`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });

        if (!avatarRes.ok) {
          const data = await avatarRes.json();
          setError(data.message || 'Cập nhật thông tin thành công nhưng upload avatar thất bại');
          setSaving(false);
          return;
        }
        
        updatedProfile = await avatarRes.json();
        setSelectedAvatarFile(null);
        setAvatarPreviewUrl(null);
      }

      setProfile(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      
      // Dispatch a custom event to notify other components (like Sidebar) to re-read localStorage
      window.dispatchEvent(new Event('user-profile-updated'));
      
      setMessage('Lưu thay đổi thành công!');
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setSaving(false);
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
    return <div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-16 w-72 rounded-2xl bg-slate-200/80" /><div className="h-40 rounded-[32px] bg-slate-200/80" /><div className="grid gap-5 lg:grid-cols-2"><div className="h-96 rounded-[28px] bg-slate-200/80" /><div className="h-96 rounded-[28px] bg-slate-200/80" /></div></div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">Tài khoản ONBI</p>
        <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-950">Thông tin cá nhân</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Quản lý thông tin tài khoản và bảo mật của bạn.</p>
      </header>

      {/* Avatar Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/75 p-5 shadow-[0_22px_65px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="relative z-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <img
            src={avatarPreviewUrl || (profile?.avatarUrl ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${process.env.NEXT_PUBLIC_API_URL}${profile.avatarUrl}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || 'User')}&background=0ea5e9&color=fff&size=128`)}
            alt={`Ảnh đại diện của ${profile?.fullName || 'phụ huynh'}`}
            className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-[0_12px_30px_rgba(11,0,139,0.18)] sm:h-28 sm:w-28"
            onError={(e) => {
              if (!avatarPreviewUrl) {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || 'User')}&background=0ea5e9&color=fff&size=128`;
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            aria-label="Chọn ảnh đại diện mới"
            className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#0B008B] text-white shadow-[0_8px_20px_rgba(11,0,139,0.24)] transition-colors hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleAvatarSelect}
            className="hidden"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-2xl font-extrabold tracking-tight text-slate-950">{profile?.fullName}</h2>
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-[#0B008B]">{profile?.role === 'parent' ? 'Parent' : profile?.role}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{profile?.email}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">Thông tin này được sử dụng để quản lý hồ sơ trẻ và các thiết bị ONBI của gia đình.</p>
          {selectedAvatarFile && <p className="mt-2 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-800">Ảnh mới sẽ được lưu cùng thông tin cá nhân</p>}
        </div>
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        {/* Profile Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4 rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-[#0B008B]"><Save className="h-5 w-5" aria-hidden="true" /></span>
            <div><h2 className="text-lg font-bold text-slate-950">Chỉnh sửa thông tin</h2><p className="mt-0.5 text-sm text-slate-500">Cập nhật thông tin liên hệ của bạn.</p></div>
          </div>

          {message && <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
          {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
            <input type="email" value={profile?.email || ''} disabled className="min-h-12 w-full cursor-not-allowed rounded-2xl border border-slate-200/80 bg-slate-100/80 px-4 text-sm text-slate-500 opacity-80" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Họ và tên</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-4 text-sm text-slate-950 outline-none transition-colors focus:border-[#0B008B] focus:ring-2 focus:ring-indigo-100" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Số điện thoại</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-4 text-sm text-slate-950 outline-none transition-colors focus:border-[#0B008B] focus:ring-2 focus:ring-indigo-100" />
          </div>

          <button type="submit" disabled={saving} className="min-h-12 w-full rounded-full bg-[#0B008B] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)] transition-colors hover:bg-[#08006D] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="space-y-4 rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><Lock className="h-5 w-5" aria-hidden="true" /></span>
            <div><h2 className="text-lg font-bold text-slate-950">Đổi mật khẩu</h2><p className="mt-0.5 text-sm text-slate-500">Thay đổi mật khẩu để bảo vệ tài khoản.</p></div>
          </div>

          {pwMessage && <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{pwMessage}</div>}
          {pwError && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{pwError}</div>}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mật khẩu hiện tại</label>
            <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-4 pr-14 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B008B] focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="button"
              onMouseDown={() => setShowOld(true)}
              onMouseUp={() => setShowOld(false)}
              onMouseLeave={() => setShowOld(false)}
              onTouchStart={() => setShowOld(true)}
              onTouchEnd={() => setShowOld(false)}
              aria-label={showOld ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
              className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mật khẩu mới</label>
            <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-4 pr-14 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B008B] focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="button"
              onMouseDown={() => setShowNew(true)}
              onMouseUp={() => setShowNew(false)}
              onMouseLeave={() => setShowNew(false)}
              onTouchStart={() => setShowNew(true)}
              onTouchEnd={() => setShowNew(false)}
              aria-label={showNew ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
              className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            </div>
          </div>

          <button type="submit" disabled={pwLoading} className="min-h-12 w-full rounded-full bg-[#0B008B] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)] transition-colors hover:bg-[#08006D] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">{pwLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}</button>
        </form>
      </div>
    </div>
  );
}
