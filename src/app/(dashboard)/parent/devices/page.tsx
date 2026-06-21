'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Link2, Plus, Unlink, Wifi, WifiOff, X } from 'lucide-react';

interface Child {
  id: string;
  name: string;
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

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Activate form
  const [showActivate, setShowActivate] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activating, setActivating] = useState(false);

  // Assign form
  const [showAssign, setShowAssign] = useState(false);
  const [assignDeviceId, setAssignDeviceId] = useState('');
  const [assignChildId, setAssignChildId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const getToken = () => localStorage.getItem('token') || '';

  const fetchData = async () => {
    try {
      const [devRes, childRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);

      if (!devRes.ok || !childRes.ok) {
        throw new Error('Failed to load devices');
      }

      const [deviceData, childData] = await Promise.all([
        devRes.json() as Promise<Device[]>,
        childRes.json() as Promise<Child[]>,
      ]);
      setDevices(deviceData);
      setChildren(childData);
    } catch {
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivating(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ activationCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Kích hoạt thất bại');
        return;
      }

      setMessage('Kích hoạt thiết bị thành công!');
      setActivationCode('');
      setShowActivate(false);
      fetchData();
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setActivating(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ deviceId: assignDeviceId, childId: assignChildId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Gán thiết bị thất bại');
        return;
      }

      setMessage('Gán thiết bị cho trẻ thành công!');
      setShowAssign(false);
      setAssignDeviceId('');
      setAssignChildId('');
      fetchData();
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async (deviceId: string, childId: string) => {
    if (!confirm('Gỡ thiết bị khỏi hồ sơ?\n\nThiết bị này sẽ không còn liên kết với bé. Bạn vẫn có thể gán lại thiết bị sau.')) return;
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices/unassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ deviceId, childId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Gỡ thất bại');
        return;
      }

      setMessage('Đã gỡ thiết bị');
      fetchData();
    } catch {
      setError('Không thể kết nối server');
    }
  };

  if (loading) return <div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-16 w-80 rounded-2xl bg-slate-200/80" /><div className="grid gap-5 lg:grid-cols-2"><div className="h-72 rounded-[28px] bg-slate-200/80" /><div className="h-72 rounded-[28px] bg-slate-200/80" /></div></div>;

  const selectedAssignDevice = devices.find((device) => device.deviceId === assignDeviceId) ?? null;
  const openAssign = (deviceId: string) => {
    setShowActivate(false);
    setAssignDeviceId(deviceId);
    setAssignChildId('');
    setShowAssign(true);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">ONBI Devices</p><h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-950">Quản lý thiết bị</h1><p className="mt-2 text-sm leading-6 text-slate-600">Theo dõi robot ONBI đã kích hoạt và gán cho từng bé.</p></div>
        <button onClick={() => { setShowAssign(false); setShowActivate(!showActivate); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)] transition-colors hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
          {showActivate ? <X className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
          {showActivate ? 'Đóng biểu mẫu' : 'Kích hoạt thiết bị mới'}
        </button>
      </header>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {message && (
        <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>
      )}

      {/* Activate Form */}
      {showActivate && (
        <form onSubmit={handleActivate} className="space-y-4 rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
          <div className="flex items-start gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><Plus className="h-5 w-5" /></span><div><h2 className="text-lg font-bold text-slate-950">Kích hoạt thiết bị mới</h2><p className="mt-0.5 text-sm text-slate-500">Nhập mã kích hoạt in trên thiết bị ONBI của bạn.</p></div></div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mã kích hoạt</label>
            <input
              type="text"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
              placeholder="ONBI-XXXX-XXXX"
              required
              className="min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-4 font-mono text-sm tracking-wider text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B008B] focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={activating}
            className="min-h-12 w-full rounded-full bg-[#0B008B] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] transition-colors hover:bg-[#08006D] disabled:opacity-50 sm:w-auto"
          >
            {activating ? 'Đang kích hoạt...' : 'Kích hoạt'}
          </button>
        </form>
      )}

      {/* Devices List */}
      {devices.length === 0 ? (
        <section className="rounded-[30px] border border-white/80 bg-white/75 px-6 py-14 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"><span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-cyan-50 text-cyan-700"><WifiOff className="h-8 w-8" /></span><h2 className="mt-5 text-lg font-bold text-slate-950">Chưa có thiết bị ONBI</h2><p className="mt-2 text-sm text-slate-600">Kích hoạt thiết bị đầu tiên để bắt đầu sử dụng.</p><button onClick={() => setShowActivate(true)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0B008B] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] hover:bg-[#08006D]"><Plus className="h-4 w-4" />Kích hoạt thiết bị mới</button></section>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-2">
          {devices.map((device) => {
            const active = device.status === 'active';
            return <article key={device.deviceId} className="flex min-h-72 flex-col rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
              <div className="flex items-start gap-4"><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{active ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}</span><div className="min-w-0 flex-1"><h2 className="truncate font-mono text-lg font-bold text-slate-950">{device.serialNumber}</h2><p className="mt-1 text-sm text-slate-500">{device.model || 'Robot ONBI'}{device.firmwareVersion ? ` · Firmware ${device.firmwareVersion}` : ''}</p></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${active ? 'bg-emerald-100 text-emerald-700' : device.status === 'deactivated' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{device.status}</span></div>

              <div className={`mt-5 rounded-2xl border p-4 ${device.assigned ? 'border-cyan-100 bg-cyan-50/70' : 'border-amber-100 bg-amber-50/60'}`}>
                <div className="flex items-center gap-2">{device.assigned ? <CheckCircle2 className="h-4 w-4 text-cyan-700" /> : <AlertTriangle className="h-4 w-4 text-amber-700" />}<span className={`text-xs font-bold uppercase tracking-wide ${device.assigned ? 'text-cyan-800' : 'text-amber-800'}`}>{device.assigned ? 'Đã gán' : 'Chưa gán'}</span></div>
                <p className="mt-2 font-semibold text-slate-900">{device.assigned ? `Gắn cho: ${device.assignedChildName || 'Hồ sơ trẻ'}` : 'Chưa gán cho hồ sơ trẻ nào'}</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">{!active ? 'Thiết bị hiện chưa hoạt động. Vui lòng kiểm tra kết nối.' : device.assigned ? 'Robot đã sẵn sàng sử dụng cùng hồ sơ của bé.' : 'Thiết bị đã kích hoạt nhưng chưa được gán cho bé nào.'}</p>
              </div>

              <div className="mt-auto pt-5">
                {device.assigned && device.assignedChildId ? <button onClick={() => handleUnassign(device.deviceId, device.assignedChildId!)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-white/70 px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"><Unlink className="h-4 w-4" />Gỡ khỏi hồ sơ</button> : children.length === 0 ? <div><p className="mb-3 text-center text-sm text-amber-700">Bạn cần tạo hồ sơ trẻ trước khi gán thiết bị.</p><Link href="/setup/step1" className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#0B008B] px-4 text-sm font-bold text-white hover:bg-[#08006D]">Tạo hồ sơ trẻ</Link></div> : active ? <button onClick={() => openAssign(device.deviceId)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0B008B] px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] transition-colors hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2"><Link2 className="h-4 w-4" />Gán cho trẻ</button> : <p className="text-center text-sm font-medium text-slate-500">Thiết bị cần hoạt động trước khi có thể gán.</p>}
              </div>
            </article>;
          })}
        </div>
      )}

      {showAssign && selectedAssignDevice && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="assign-device-title">
          <form onSubmit={handleAssign} className="w-full max-w-md rounded-[28px] border border-white/80 bg-white/95 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><h2 id="assign-device-title" className="text-xl font-bold text-slate-950">Gán thiết bị cho trẻ</h2><p className="mt-1 text-sm text-slate-500">Thiết bị: <span className="font-mono font-semibold text-slate-700">{selectedAssignDevice.serialNumber}</span></p></div><button type="button" onClick={() => setShowAssign(false)} aria-label="Đóng" className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
            <div className="mt-6"><label className="mb-1.5 block text-sm font-semibold text-slate-700">Hồ sơ trẻ</label><select value={assignChildId} onChange={(e) => setAssignChildId(e.target.value)} required className="min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-900 outline-none focus:border-[#0B008B] focus:ring-2 focus:ring-indigo-100"><option value="">Chọn trẻ</option>{children.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}</select></div>
            <div className="mt-6 flex gap-3"><button type="button" onClick={() => setShowAssign(false)} className="min-h-11 flex-1 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50">Hủy</button><button type="submit" disabled={assigning} className="min-h-11 flex-1 rounded-full bg-[#0B008B] px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] hover:bg-[#08006D] disabled:opacity-50">{assigning ? 'Đang gán...' : 'Xác nhận gán'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
