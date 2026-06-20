'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Child { id: string; name: string; }
interface Device {
  deviceId: string;
  serialNumber: string;
  model?: string;
  assigned?: boolean;
  assignedChildId?: string | null;
}

export default function SetupStep3() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [childId, setChildId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([api.get<Child[]>('/children'), api.get<Device[]>('/devices')])
      .then(([childrenResponse, devicesResponse]) => {
        const childData = childrenResponse.data;
        const activatedId = localStorage.getItem('activatedDeviceId');
        const activatedSerial = localStorage.getItem('activatedDeviceSerial');
        let deviceData = devicesResponse.data.filter((device) => !device.assigned);

        if (activatedId && !deviceData.some((device) => String(device.deviceId) === activatedId)) {
          deviceData = [{ deviceId: activatedId, serialNumber: activatedSerial || `ONBI #${activatedId}` }, ...deviceData];
        }

        setChildren(childData);
        setDevices(deviceData);
        setChildId(childData[0]?.id ? String(childData[0].id) : '');
        setDeviceId(activatedId || (deviceData[0]?.deviceId ? String(deviceData[0].deviceId) : ''));
      })
      .catch(() => setError('Không thể tải hồ sơ trẻ và thiết bị. Vui lòng kiểm tra kết nối rồi thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!childId || !deviceId) {
      setError('Vui lòng chọn đầy đủ hồ sơ trẻ và thiết bị.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await api.post('/devices/assign', { childId, deviceId });
      localStorage.removeItem('activatedDeviceId');
      localStorage.removeItem('activatedDeviceSerial');
      setSuccess(true);
      window.setTimeout(() => router.replace('/parent/dashboard'), 1200);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? 'Không thể gán thiết bị. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-dvh bg-slate-50 px-4 py-8"><div className="mx-auto max-w-xl animate-pulse space-y-4"><div className="h-8 w-56 rounded bg-slate-200" /><div className="h-[440px] rounded-3xl bg-white" /></div></div>;
  }

  if (success) {
    return <main className="grid min-h-dvh place-items-center bg-slate-50 px-4"><section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="text-sm font-semibold text-cyan-700">THIẾT LẬP HOÀN TẤT</p><h1 className="mt-3 text-2xl font-bold text-slate-950">Thiết bị đã được gán</h1><p className="mt-3 leading-7 text-slate-600">ONBI đã sẵn sàng đồng hành cùng bé. Đang chuyển bạn tới trang tổng quan.</p></section></main>;
  }

  const selectedChild = children.find((child) => String(child.id) === childId);
  const selectedDevice = devices.find((device) => String(device.deviceId) === deviceId);

  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-xl">
        <button onClick={() => router.push('/setup')} className="min-h-11 rounded-lg px-1 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600">Quay lại thiết lập</button>

        <ol aria-label="Tiến trình thiết lập" className="mt-4 grid grid-cols-3 gap-2">
          <Step number="1" label="Hồ sơ trẻ" complete />
          <Step number="2" label="Mã thiết bị" complete />
          <Step number="3" label="Gán thiết bị" current />
        </ol>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="border-b border-slate-200 pb-6">
            <p className="text-sm font-bold tracking-wide text-cyan-700">BƯỚC 3/3</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Gán thiết bị cho trẻ</h1>
            <p className="mt-3 max-w-lg leading-7 text-slate-600">Chọn hồ sơ trẻ và thiết bị ONBI vừa kích hoạt. Bạn có thể thay đổi liên kết này sau trong phần quản lý thiết bị.</p>
          </div>

          {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</div>}

          <form onSubmit={submit} className="mt-6 space-y-5">
            <label className="block text-sm font-semibold text-slate-800">
              Hồ sơ trẻ
              <select value={childId} onChange={(event) => setChildId(event.target.value)} disabled={children.length === 0} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition-colors focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100 disabled:text-slate-400">
                {children.length === 0 && <option value="">Chưa có hồ sơ trẻ</option>}
                {children.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
              </select>
              <span className="mt-2 block text-sm font-normal leading-6 text-slate-500">Hồ sơ nhận dữ liệu học tập và cảnh báo từ thiết bị.</span>
            </label>

            <label className="block text-sm font-semibold text-slate-800">
              Thiết bị ONBI
              <select value={deviceId} onChange={(event) => setDeviceId(event.target.value)} disabled={devices.length === 0} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition-colors focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100 disabled:text-slate-400">
                {devices.length === 0 && <option value="">Chưa có thiết bị khả dụng</option>}
                {devices.map((device) => <option key={device.deviceId} value={device.deviceId}>{device.serialNumber}{device.model ? ` · ${device.model}` : ''}</option>)}
              </select>
              <span className="mt-2 block text-sm font-normal leading-6 text-slate-500">Chỉ hiển thị thiết bị đã kích hoạt và chưa gán cho trẻ khác.</span>
            </label>

            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
              <p className="text-sm font-bold text-slate-900">Xác nhận liên kết</p>
              <p className="mt-2 text-sm leading-6 text-slate-700"><strong>{selectedDevice?.serialNumber ?? 'Thiết bị chưa chọn'}</strong> sẽ được dùng để theo dõi phiên học của <strong>{selectedChild?.name ?? 'hồ sơ chưa chọn'}</strong>.</p>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <button type="button" onClick={() => router.push('/setup')} className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">Quay lại</button>
              <button type="submit" disabled={submitting || !childId || !deviceId} className="min-h-12 rounded-xl bg-[#000080] px-5 font-semibold text-white transition-colors hover:bg-[#000066] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">{submitting ? 'Đang gán thiết bị…' : 'Xác nhận gán'}</button>
            </div>
          </form>
        </section>

        <p className="mx-auto mt-5 max-w-md text-center text-sm leading-6 text-slate-500">Cần hỗ trợ? Liên hệ đội ngũ ONBI và cung cấp số serial in trên thiết bị.</p>
      </div>
    </main>
  );
}

function Step({ number, label, complete = false, current = false }: { number: string; label: string; complete?: boolean; current?: boolean }) {
  return <li aria-current={current ? 'step' : undefined} className={`rounded-xl border px-3 py-3 ${current ? 'border-[#000080] bg-white' : 'border-slate-200 bg-slate-100'}`}><span className={`block text-xs font-bold ${current ? 'text-[#000080]' : 'text-slate-500'}`}>{complete ? 'XONG' : `BƯỚC ${number}`}</span><span className={`mt-1 block text-xs font-semibold sm:text-sm ${current ? 'text-slate-950' : 'text-slate-600'}`}>{label}</span></li>;
}
