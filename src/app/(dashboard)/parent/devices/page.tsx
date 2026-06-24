'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Ban, CheckCircle2, Link2, Plus, Unlink, Wifi, WifiOff, X } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'available' | 'deactivated'>('available');

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
      setActiveTab('available');
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

  const availableDevices = devices.filter((device) => device.status !== 'deactivated');
  const deactivatedDevices = devices.filter((device) => device.status === 'deactivated');

  const renderAvailableDevice = (device: Device) => {
    const active = device.status === 'active';

    return (
      <article key={device.deviceId} className="flex min-h-72 flex-col rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
        <div className="flex items-start gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {active ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-mono text-lg font-bold text-slate-950">{device.serialNumber}</h3>
            <p className="mt-1 text-sm text-slate-500">{device.model || 'Robot ONBI'}{device.firmwareVersion ? ` · Firmware ${device.firmwareVersion}` : ''}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
          </span>
        </div>

        {!active ? (
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <div className="flex items-center gap-2 text-amber-800"><AlertTriangle className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-wide">Cần kiểm tra</span></div>
            <p className="mt-2 font-semibold text-slate-900">Thiết bị hiện chưa hoạt động</p>
            <p className="mt-1 text-sm leading-5 text-slate-600">Vui lòng kiểm tra nguồn điện và kết nối mạng của thiết bị.</p>
            {device.assigned && <p className="mt-3 text-sm font-medium text-slate-700">Gắn cho: {device.assignedChildName || 'Hồ sơ trẻ'}</p>}
          </div>
        ) : device.assigned ? (
          <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
            <div className="flex items-center gap-2 text-cyan-800"><CheckCircle2 className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-wide">Đã gán</span></div>
            <p className="mt-2 font-semibold text-slate-900">Gắn cho: {device.assignedChildName || 'Hồ sơ trẻ'}</p>
            <p className="mt-1 text-sm leading-5 text-slate-600">Robot đã sẵn sàng sử dụng cùng hồ sơ của bé.</p>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <div className="flex items-center gap-2 text-amber-800"><AlertTriangle className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-wide">Chưa gán</span></div>
            <p className="mt-2 font-semibold text-slate-900">Chưa gán cho hồ sơ trẻ nào</p>
            <p className="mt-1 text-sm leading-5 text-slate-600">Thiết bị đã kích hoạt nhưng chưa được gán cho bé nào.</p>
          </div>
        )}

        <div className="mt-auto pt-5">
          {device.assigned && device.assignedChildId ? (
            <button onClick={() => handleUnassign(device.deviceId, device.assignedChildId!)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-white/70 px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
              <Unlink className="h-4 w-4" />Gỡ khỏi hồ sơ
            </button>
          ) : !active ? (
            <p className="text-center text-sm font-medium text-slate-500">Thiết bị cần hoạt động trước khi có thể gán.</p>
          ) : children.length === 0 ? (
            <div>
              <p className="mb-3 text-center text-sm text-amber-700">Bạn cần tạo hồ sơ trẻ trước khi gán thiết bị.</p>
              <Link href="/setup/step1" className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#0B008B] px-4 text-sm font-bold text-white hover:bg-[#08006D]">Tạo hồ sơ trẻ</Link>
            </div>
          ) : (
            <button onClick={() => openAssign(device.deviceId)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0B008B] px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] transition-colors hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
              <Link2 className="h-4 w-4" />Gán cho trẻ
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">ONBI DEVICES</p><h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-950">Thiết bị ONBI</h1><p className="mt-2 text-sm leading-6 text-slate-600">Quản lý robot đã kích hoạt, gán cho bé hoặc đã vô hiệu hóa.</p></div>
        <button onClick={() => { setShowAssign(false); setShowActivate(!showActivate); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)] transition-colors hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
          {showActivate ? <X className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
          {showActivate ? 'Đóng biểu mẫu' : 'Kích hoạt thiết bị'}
        </button>
      </header>

      <div className="overflow-x-auto pb-1" role="tablist" aria-label="Lọc thiết bị theo trạng thái">
        <div className="inline-flex min-w-max gap-1.5 rounded-full border border-white/80 bg-white/70 p-1.5 shadow-sm backdrop-blur-xl">
          <button type="button" role="tab" aria-selected={activeTab === 'available'} onClick={() => setActiveTab('available')} className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-all ${activeTab === 'available' ? 'bg-[#0B008B] text-white shadow-[0_8px_20px_rgba(11,0,139,0.20)]' : 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-900'}`}>
            Khả dụng <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs ${activeTab === 'available' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{availableDevices.length}</span>
          </button>
          <button type="button" role="tab" aria-selected={activeTab === 'deactivated'} onClick={() => setActiveTab('deactivated')} className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-all ${activeTab === 'deactivated' ? 'bg-[#0B008B] text-white shadow-[0_8px_20px_rgba(11,0,139,0.20)]' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'}`}>
            Đã vô hiệu hóa <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs ${activeTab === 'deactivated' ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-700'}`}>{deactivatedDevices.length}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {message && (
        <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>
      )}

      {/* Activate Form */}
      {showActivate && (
        <form onSubmit={handleActivate} className="space-y-4 rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
          <div className="flex items-start gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><Plus className="h-5 w-5" /></span><div><h2 className="text-lg font-bold text-slate-950">Nhập mã kích hoạt</h2><p className="mt-0.5 text-sm text-slate-500">Mã được in trên robot ONBI của bạn.</p></div></div>

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
        <div>
          {activeTab === 'available' ? (
            <section aria-labelledby="available-devices-title">
              <div className="mb-4">
                <h2 id="available-devices-title" className="text-xl font-bold text-slate-950">Thiết bị khả dụng</h2>
                <p className="mt-1 text-sm text-slate-500">Thiết bị đang hoạt động hoặc có thể gán cho bé.</p>
              </div>
              {availableDevices.length > 0 ? (
                <div className="grid items-start gap-5 lg:grid-cols-2">{availableDevices.map(renderAvailableDevice)}</div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/55 px-5 py-10 text-center text-sm text-slate-500">Hiện chưa có thiết bị khả dụng.</div>
              )}
            </section>
          ) : (
            <section aria-labelledby="deactivated-devices-title">
              <div className="mb-4">
                <h2 id="deactivated-devices-title" className="text-xl font-bold text-slate-800">Thiết bị đã vô hiệu hóa</h2>
                <p className="mt-1 text-sm text-slate-500">Thiết bị không còn khả dụng trong tài khoản.</p>
              </div>
              {deactivatedDevices.length > 0 ? (
                <div className="grid items-start gap-5 lg:grid-cols-2">
                {deactivatedDevices.map((device) => (
                  <article key={device.deviceId} className="rounded-[28px] border border-rose-100/80 bg-gradient-to-b from-white/75 to-rose-50/70 p-5 opacity-90 shadow-[0_16px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-6">
                    <div className="flex items-start gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-700"><Ban className="h-5 w-5" /></span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-mono text-lg font-bold text-slate-800">{device.serialNumber}</h3>
                        <p className="mt-1 text-sm text-slate-500">{device.model || 'Robot ONBI'}{device.firmwareVersion ? ` · Firmware ${device.firmwareVersion}` : ''}</p>
                      </div>
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">Đã vô hiệu hóa</span>
                    </div>
                    <div className="mt-5 rounded-2xl border border-rose-100 bg-white/60 p-4">
                      <p className="text-sm leading-6 text-slate-600">Thiết bị này đã bị vô hiệu hóa và hiện không thể sử dụng hoặc gán cho hồ sơ trẻ.</p>
                    </div>
                  </article>
                ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/55 px-5 py-10 text-center text-sm text-slate-500">Không có thiết bị đã vô hiệu hóa.</div>
              )}
            </section>
          )}
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
