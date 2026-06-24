'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Ban,
  Boxes,
  CheckCircle2,
  CircleCheckBig,
  CirclePause,
  Filter,
  Plus,
  RotateCcw,
  Trash2,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Device {
  id: string;
  serialNumber?: string;
  activationCode: string;
  model?: string;
  firmwareVersion?: string;
  status: string;
  activatedBy?: string | null;
  activatedByUser?: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  createdAt: string;
}

interface DeviceStats {
  total: number;
  active: number;
  inactive: number;
  deactivated: number;
}

const statusMeta: Record<string, { label: string; className: string }> = {
  active: { label: 'Đang hoạt động', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80' },
  inactive: { label: 'Chưa hoạt động', className: 'bg-amber-50 text-amber-700 ring-amber-200/80' },
  deactivated: { label: 'Đã vô hiệu hóa', className: 'bg-rose-50 text-rose-700 ring-rose-200/80' },
};

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [createdDevice, setCreatedDevice] = useState<Device | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [deviceToDeactivate, setDeviceToDeactivate] = useState<Device | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getToken = () => localStorage.getItem('token') || '';

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterUserId) params.set('userId', filterUserId);
      const query = params.toString() ? `?${params.toString()}` : '';

      const [devRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/devices${query}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/devices/stats`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      if (devRes.ok) setDevices(await devRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch {
      // Keep the current page state when the API is temporarily unavailable.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus, filterUserId]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => setMessage(''), 4500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    setError('');
    setMessage('');
    setCreatedDevice(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ serialNumber }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Tạo thiết bị thất bại');
        return;
      }

      setCreatedDevice(data);
      setMessage('Đã cấp mã kích hoạt. Model & firmware sẽ tự điền khi thiết bị kết nối.');
      setShowForm(false);
      setSerialNumber('');
      fetchData();
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const endpoint = currentStatus === 'active' ? 'deactivate' : 'reactivate';
    setStatusLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/devices/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        await fetchData();
        setDeviceToDeactivate(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Thao tác thất bại');
      }
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deviceToDelete) return;
    setDeleteLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/devices/${deviceToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        setMessage('Đã xóa thiết bị.');
        setDeviceToDelete(null);
        await fetchData();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Không thể xóa thiết bị');
      }
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div className="rounded-3xl border border-white/80 bg-white/75 p-8 text-sm text-slate-500 shadow-sm">Đang tải thiết bị...</div>;
  }

  const statCards = stats
    ? [
        { label: 'Tổng thiết bị', value: stats.total, icon: Boxes, color: 'text-[#0B008B]', iconBg: 'bg-indigo-50' },
        { label: 'Đang hoạt động', value: stats.active, icon: CircleCheckBig, color: 'text-emerald-600', iconBg: 'bg-emerald-50' },
        { label: 'Chưa hoạt động', value: stats.inactive, icon: CirclePause, color: 'text-amber-600', iconBg: 'bg-amber-50' },
        { label: 'Đã vô hiệu hóa', value: stats.deactivated, icon: Ban, color: 'text-rose-600', iconBg: 'bg-rose-50' },
      ]
    : [];

  return (
    <div className="space-y-6 text-slate-900">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Kho thiết bị ONBI</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Quản lý thiết bị</h1>
          <p className="mt-2 text-sm text-slate-500">Theo dõi và quản lý toàn bộ robot ONBI trong hệ thống.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(11,0,139,0.22)] transition-colors hover:bg-[#08006D] focus:outline-none focus:ring-2 focus:ring-[#0B008B]/25"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Đóng' : 'Tạo thiết bị'}
        </button>
      </header>

      {stats && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Thống kê thiết bị">
          {statCards.map(({ label, value, icon: Icon, color, iconBg }) => (
            <article key={label} className="rounded-[24px] border border-white/80 bg-white/75 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className={`mt-2 text-3xl font-bold tabular-nums ${color}`}>{value}</p>
                </div>
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${iconBg} ${color}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {message && (
        <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-top-2 fade-in duration-200 sm:right-6 sm:top-6" role="status" aria-live="polite">
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur-xl">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-950">Tạo thiết bị thành công</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">Mã kích hoạt đã được hệ thống tạo.</p>
            </div>
            <button
              type="button"
              onClick={() => setMessage('')}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {createdDevice && (
        <section className="rounded-[24px] border border-cyan-200/70 bg-cyan-50/75 p-5 shadow-sm backdrop-blur-xl" aria-label="Thiết bị vừa tạo">
          <p className="text-sm font-semibold text-slate-950">Thiết bị đã được tạo</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Serial Number</p>
              <p className="mt-1 font-mono text-sm font-semibold">{createdDevice.serialNumber || <span className="font-sans font-normal italic text-slate-400">Chờ thiết bị kết nối</span>}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mã kích hoạt do server tạo</p>
              <p className="mt-1 font-mono text-base font-bold text-[#0B008B]">{createdDevice.activationCode}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-600">Hãy lưu mã này để cung cấp cho người dùng khi kích hoạt thiết bị.</p>
        </section>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="space-y-5 rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Cấp mã kích hoạt</h2>
            <p className="mt-1 text-sm text-slate-500">Nhập serial do đội phần cứng cung cấp. Mã kích hoạt server tự tạo; <span className="font-medium text-slate-700">model & firmware sẽ tự điền khi thiết bị (Jetson) kết nối.</span></p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:max-w-md">
            <label className="text-sm font-semibold text-slate-700">
              Serial Number
              <input
                type="text"
                value={serialNumber}
                onChange={(event) => setSerialNumber(event.target.value)}
                placeholder="JETSON-AABBCCDD"
                required
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 font-mono text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B008B] focus:ring-2 focus:ring-[#0B008B]/15"
              />
            </label>
          </div>
          <button type="submit" disabled={formLoading} className="min-h-12 rounded-full bg-[#0B008B] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(11,0,139,0.2)] transition-colors hover:bg-[#08006D] disabled:cursor-not-allowed disabled:opacity-50">
            {formLoading ? 'Đang tạo...' : 'Cấp mã kích hoạt'}
          </button>
        </form>
      )}

      <section className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl" aria-label="Bộ lọc thiết bị">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="h-4 w-4 text-cyan-700" aria-hidden="true" />
            Bộ lọc
          </div>
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="min-h-11 rounded-full border border-slate-200/80 bg-white px-4 text-sm text-slate-900 outline-none focus:border-[#0B008B] focus:ring-2 focus:ring-[#0B008B]/15"
            aria-label="Lọc theo trạng thái"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Chưa hoạt động</option>
            <option value="deactivated">Đã vô hiệu hóa</option>
          </select>
          <input
            type="text"
            value={filterUserId}
            onChange={(event) => setFilterUserId(event.target.value)}
            placeholder="Nhập User ID..."
            className="min-h-11 w-full rounded-full border border-slate-200/80 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0B008B] focus:ring-2 focus:ring-[#0B008B]/15 lg:max-w-xs"
            aria-label="Lọc theo User ID"
          />
          {(filterStatus || filterUserId) && (
            <button
              type="button"
              onClick={() => { setFilterStatus(''); setFilterUserId(''); }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Đặt lại
            </button>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/75 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl" aria-label="Danh sách thiết bị">
        {devices.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><Boxes className="h-6 w-6" /></span>
            <h2 className="mt-4 text-lg font-bold text-slate-950">Chưa có thiết bị nào</h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">Tạo thiết bị đầu tiên để bắt đầu quản lý robot ONBI.</p>
            <button type="button" onClick={() => setShowForm(true)} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0B008B] px-5 text-sm font-semibold text-white hover:bg-[#08006D]">
              <Plus className="h-4 w-4" /> Tạo thiết bị
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="border-b border-slate-200/70 bg-slate-50/80 text-left">
                <tr>
                  <th className="px-5 py-4 font-semibold text-slate-600">Thiết bị</th>
                  <th className="px-5 py-4 font-semibold text-slate-600">Trạng thái</th>
                  <th className="px-5 py-4 font-semibold text-slate-600">Tài khoản kích hoạt</th>
                  <th className="px-5 py-4 font-semibold text-slate-600">Ngày tạo</th>
                  <th className="px-5 py-4 text-right font-semibold text-slate-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {devices.map((device) => {
                  const meta = statusMeta[device.status] ?? { label: device.status, className: 'bg-slate-100 text-slate-600 ring-slate-200' };
                  const assignedAccount = device.activatedByUser;

                  return (
                    <tr key={device.id} className="transition-colors hover:bg-cyan-50/45">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${device.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {device.status === 'active' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                          </span>
                          <div>
                            <Link href={`/admin/devices/${device.id}`} className="font-mono font-semibold text-slate-950 transition-colors hover:text-[#0B008B] hover:underline">
                              {device.serialNumber || <span className="font-sans font-normal italic text-slate-400">Chờ thiết bị kết nối</span>}
                            </Link>
                            <p className="mt-1 text-xs text-slate-500">Mã kích hoạt: <span className="font-mono">{device.activationCode}</span></p>
                            <p className="mt-0.5 text-xs text-slate-400">{device.model || '—'}{device.firmwareVersion ? ` · FW ${device.firmwareVersion}` : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${meta.className}`}>{meta.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        {assignedAccount ? (
                          <div>
                            <p className="font-medium text-slate-800">{assignedAccount.email}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {assignedAccount.fullName || `User ID: ${assignedAccount.id}`}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">Chưa kích hoạt</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{new Date(device.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {device.status === 'active' ? (
                            <button type="button" onClick={() => setDeviceToDeactivate(device)} className="min-h-10 rounded-full border border-rose-200 bg-rose-50/60 px-4 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100">
                              Vô hiệu hóa
                            </button>
                          ) : (
                            <button type="button" onClick={() => handleToggleStatus(device.id, device.status)} disabled={statusLoading} className="min-h-10 rounded-full border border-emerald-200 bg-emerald-50/60 px-4 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50">
                              Kích hoạt lại
                            </button>
                          )}
                          <button type="button" onClick={() => setDeviceToDelete(device)} aria-label="Xóa thiết bị" title="Xóa thiết bị" className="grid min-h-10 min-w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Dialog open={!!deviceToDeactivate} onOpenChange={(open) => { if (!open && !statusLoading) setDeviceToDeactivate(null); }}>
        <DialogContent className="overflow-hidden rounded-[28px] border border-slate-200/80 !bg-white !text-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold leading-6 text-slate-950">Vô hiệu hóa thiết bị?</DialogTitle>
            <DialogDescription className="text-sm leading-6 text-slate-600">
              Thiết bị <span className="font-mono font-semibold text-slate-800">{deviceToDeactivate?.serialNumber}</span> sẽ không thể được sử dụng cho đến khi được kích hoạt lại.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 border-slate-200 !bg-slate-50">
            <Button variant="outline" onClick={() => setDeviceToDeactivate(null)} disabled={statusLoading} className="min-h-10 rounded-full border-slate-300 bg-white px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-950">Hủy</Button>
            <Button
              variant="destructive"
              disabled={statusLoading || !deviceToDeactivate}
              onClick={() => deviceToDeactivate && handleToggleStatus(deviceToDeactivate.id, deviceToDeactivate.status)}
              className="min-h-10 rounded-full bg-rose-600 px-5 text-white hover:bg-rose-700"
            >
              {statusLoading ? 'Đang xử lý...' : 'Vô hiệu hóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deviceToDelete} onOpenChange={(open) => { if (!open && !deleteLoading) setDeviceToDelete(null); }}>
        <DialogContent className="overflow-hidden rounded-[28px] border border-slate-200/80 !bg-white !text-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold leading-6 text-slate-950">Xóa thiết bị?</DialogTitle>
            <DialogDescription className="text-sm leading-6 text-slate-600">
              Thiết bị <span className="font-mono font-semibold text-slate-800">{deviceToDelete?.serialNumber || deviceToDelete?.activationCode}</span> sẽ bị xóa vĩnh viễn, kèm toàn bộ lịch sử phiên giám sát của nó. Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 border-slate-200 !bg-slate-50">
            <Button variant="outline" onClick={() => setDeviceToDelete(null)} disabled={deleteLoading} className="min-h-10 rounded-full border-slate-300 bg-white px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-950">Hủy</Button>
            <Button
              variant="destructive"
              disabled={deleteLoading || !deviceToDelete}
              onClick={handleDelete}
              className="min-h-10 rounded-full bg-rose-600 px-5 text-white hover:bg-rose-700"
            >
              {deleteLoading ? 'Đang xóa...' : 'Xóa thiết bị'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
