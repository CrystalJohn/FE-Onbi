'use client'

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Bot, Link2, Unlink, CalendarDays, User, LoaderCircle } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
}

interface ChildDevice {
  deviceId: string;
  serialNumber: string;
  model?: string;
  status: string;
}

interface Device {
  deviceId: string;
  serialNumber: string;
  model?: string;
  firmwareVersion?: string;
  status: string;
  assigned: boolean;
  assignedChildId?: string | null;
  assignedChildName?: string | null;
  assignedAt?: string | null;
}

export default function ChildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Device assignment state
  const [assignedDevice, setAssignedDevice] = useState<ChildDevice | null>(null);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [deviceActionLoading, setDeviceActionLoading] = useState(false);

  // Delete modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getToken = () => localStorage.getItem('token') || '';

  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch child profile
      const childRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!childRes.ok) throw new Error();
      const childData = await childRes.json();
      setChild(childData);
      setName(childData.name);
      setDateOfBirth(childData.dateOfBirth?.split('T')[0] || '');
      setGender(childData.gender);

      // 2. Fetch child's device
      const devRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${id}/devices`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (devRes.ok) {
        const childDevices = await devRes.json();
        setAssignedDevice(childDevices[0] || null);
      } else {
        setAssignedDevice(null);
      }

      // 3. Fetch parent's all devices
      const allDevRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (allDevRes.ok) {
        const parentDevices = await allDevRes.json();
        setAllDevices(parentDevices);
      }

    } catch (err) {
      setError('Không thể tải thông tin hồ sơ.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Escape key listener for modals
  useEffect(() => {
    if (!showDeleteConfirm) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowDeleteConfirm(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showDeleteConfirm]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name, dateOfBirth, gender }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Cập nhật thất bại');
        return;
      }

      setMessage('Cập nhật thông tin thành công!');
    } catch {
      setError('Không thể kết nối máy chủ');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceId) return;
    setDeviceActionLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ deviceId: selectedDeviceId, childId: id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Gán thiết bị thất bại.');
        return;
      }

      setMessage('Đã gán thiết bị cho bé thành công!');
      setSelectedDeviceId('');
      await fetchData();
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setDeviceActionLoading(false);
    }
  };

  const handleUnassignDevice = async (deviceId: string) => {
    setDeviceActionLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/unassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ deviceId, childId: id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Gỡ thiết bị thất bại.');
        return;
      }

      setMessage('Đã gỡ thiết bị khỏi hồ sơ.');
      await fetchData();
    } catch {
      setError('Không thể kết nối máy chủ.');
    } finally {
      setDeviceActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      setShowDeleteConfirm(false);
      router.push('/parent/children');
    } catch {
      setError('Xóa thất bại');
    } finally {
      setDeleting(false);
    }
  };

  // Filter unassigned devices
  const availableDevices = allDevices.filter(d => !d.assigned || d.assignedChildId === null);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-5">
        <div className="h-12 w-64 rounded-xl bg-slate-200" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 rounded-[32px] bg-slate-200" />
          <div className="h-96 rounded-[32px] bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-center">
        <p className="text-base text-red-600 font-semibold">{error || 'Không tìm thấy hồ sơ trẻ'}</p>
        <button
          onClick={() => router.push('/parent/children')}
          className="mt-4 px-5 py-2 rounded-full bg-slate-100 text-sm font-semibold hover:bg-slate-200 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.push('/parent/children')}
          aria-label="Quay lại"
          className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">Chi tiết hồ sơ</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Quản lý bé {child.name}</h1>
        </div>
      </header>

      {message && (
        <div role="alert" className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* ── Left Column: Personal Info Form ── */}
        <form onSubmit={handleUpdate} className="rounded-[32px] border border-white/80 bg-gradient-to-b from-white via-white/95 to-cyan-50/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:p-6 space-y-5 relative">
          <div className="border-b border-slate-100/80 pb-3 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-50 text-cyan-800"><User className="h-4 w-4" /></span>
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-tight">Thông tin cá nhân</h2>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Tên của bé
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Ngày sinh
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Giới tính
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 min-h-12 flex items-center justify-center gap-2 rounded-full bg-[#0B008B] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)] transition-colors duration-200 hover:bg-[#07006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B]"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 min-h-11 flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/60 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Trash2 className="w-4 h-4" />
              Xóa hồ sơ bé
            </button>
          </div>
        </form>

        {/* ── Right Column: ONBI Device Setup ── */}
        <div className="rounded-[32px] border border-white/80 bg-gradient-to-b from-white via-white/95 to-cyan-50/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:p-6 space-y-5">
          <div className="border-b border-slate-100/80 pb-3 flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-50 text-cyan-800"><Bot className="h-4 w-4" /></span>
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-tight">Thiết bị ONBI kết nối</h2>
          </div>

          {assignedDevice ? (
            <div className="space-y-5">
              <div className="rounded-[22px] border border-white/80 bg-white/65 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-md">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Robot đã gán</p>
                <p className="mt-3 font-bold text-slate-950 text-lg">{assignedDevice.serialNumber}</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {assignedDevice.model || 'Robot ONBI Companion'} ·{' '}
                  <span className={assignedDevice.status === 'active' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
                    {assignedDevice.status === 'active' ? 'Đang hoạt động' : 'Ngoại tuyến'}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleUnassignDevice(assignedDevice.deviceId)}
                disabled={deviceActionLoading}
                className="w-full min-h-12 flex items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50/70 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100 hover:border-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Unlink className="w-4 h-4" />
                {deviceActionLoading ? 'Đang xử lý...' : 'Gỡ thiết bị ONBI'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-[22px] border border-amber-100 bg-amber-50/40 p-4 text-sm text-slate-600 leading-relaxed">
                Hồ sơ này chưa có thiết bị ONBI đồng hành. Gán thiết bị để bắt đầu ghi nhận tư thế ngồi chuẩn và theo dõi phiên Pomodoro tự động.
              </div>

              {availableDevices.length > 0 ? (
                <form onSubmit={handleAssignDevice} className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Chọn thiết bị khả dụng
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => setSelectedDeviceId(e.target.value)}
                      required
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                    >
                      <option value="">-- Chọn một Robot --</option>
                      {availableDevices.map((d) => {
                        const isDeactivated = d.status === 'deactivated';
                        return (
                          <option key={d.deviceId} value={d.deviceId} disabled={isDeactivated}>
                            {d.serialNumber} ({d.model || 'Robot ONBI'}){isDeactivated ? ' - Đã bị vô hiệu hóa' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </label>

                  <button
                    type="submit"
                    disabled={deviceActionLoading || !selectedDeviceId}
                    className="w-full min-h-12 flex items-center justify-center gap-2 rounded-full bg-[#0B008B] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)] transition-colors duration-200 hover:bg-[#07006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] disabled:opacity-50"
                  >
                    <Link2 className="w-4 h-4" />
                    {deviceActionLoading ? 'Đang kết nối...' : 'Gán thiết bị này'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-slate-500 italic">
                    Không tìm thấy thiết bị ONBI trống nào thuộc tài khoản của bạn.
                  </p>
                  <Link
                    href="/parent/devices"
                    className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border border-slate-200/80 bg-white/60 text-sm font-semibold text-slate-600 transition-colors hover:border-cyan-200 hover:bg-white hover:text-[#0B008B]"
                  >
                    Kích hoạt hoặc Quản lý thiết bị
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Custom Delete Confirm Modal ── */}
      {showDeleteConfirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-[28px] border border-white/80 bg-white p-6 shadow-[0_32px_80px_rgba(15,23,42,0.22)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h2 id="confirm-title" className="mt-4 text-lg font-bold text-slate-950">Xóa hồ sơ bé?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bạn sắp xóa hồ sơ của <span className="font-semibold text-slate-900">{child.name}</span>. Thao tác này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu phiên học/cảnh báo liên quan.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 min-h-11 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">Hủy</button>
              <button onClick={() => void handleDelete()} disabled={deleting} className="flex-1 min-h-11 rounded-full bg-red-600 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">{deleting ? 'Đang xóa…' : 'Xóa hồ sơ'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
