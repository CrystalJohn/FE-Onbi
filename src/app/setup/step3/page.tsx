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
    return <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0F172A] p-4"><div className="mx-auto max-w-xl animate-pulse space-y-4"><div className="h-8 w-56 rounded bg-slate-200/20" /><div className="h-[440px] rounded-3xl bg-white/10" /></div></main>;
  }

  if (success) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0F172A] p-4 sm:p-6 lg:p-12">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-900/20 blur-[100px]" />
          <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0B008B]/30 blur-[120px]" />
        </div>
        <section className="relative w-full max-w-md rounded-[32px] border border-white/40 bg-gradient-to-b from-[#F0F5FA] to-[#E2EAF1] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <p className="text-sm font-bold tracking-wide text-[#0B008B]">THIẾT LẬP HOÀN TẤT</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">Thiết bị đã được gán</h1>
          <p className="mt-3 leading-7 text-slate-600">ONBI đã sẵn sàng đồng hành cùng bé. Đang chuyển bạn tới trang tổng quan.</p>
        </section>
      </main>
    );
  }

  const selectedChild = children.find((child) => String(child.id) === childId);
  const selectedDevice = devices.find((device) => String(device.deviceId) === deviceId);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0F172A] p-4 sm:p-6 lg:p-12">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-900/20 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#0B008B]/30 blur-[120px]" />
      </div>

      <section className="relative w-full max-w-[600px] flex flex-col items-center rounded-[32px] border border-white/40 bg-gradient-to-b from-[#F0F5FA] to-[#E2EAF1] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)] sm:p-10 lg:p-12 backdrop-blur-2xl">
      <div className="w-full max-w-lg">
        
        <section className="mt-2 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm sm:p-10 backdrop-blur-md">
          <div className="border-b border-slate-200 pb-5">
            <h1 className="text-[22px] font-extrabold tracking-tight text-[#0B008B] sm:text-2xl">Bước 3: Gán thiết bị cho trẻ</h1>
            <p className="mt-2.5 leading-relaxed text-sm text-slate-500">Chọn hồ sơ trẻ và thiết bị ONBI vừa kích hoạt. Bạn có thể thay đổi liên kết này sau trong phần quản lý thiết bị.</p>
          </div>

          {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</div>}

          <form onSubmit={submit} className="mt-6 space-y-5">
            <label className="block text-[13px] font-bold text-slate-800">
              Hồ sơ trẻ
              <select value={childId} onChange={(event) => setChildId(event.target.value)} disabled={children.length === 0} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-[#0B008B] focus:ring-1 focus:ring-[#0B008B] disabled:bg-slate-50 disabled:text-slate-400 shadow-sm appearance-none">
                {children.length === 0 && <option value="">Chưa có hồ sơ trẻ</option>}
                {children.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
              </select>
              <span className="mt-2 block text-[12px] font-normal text-slate-500">Hồ sơ nhận dữ liệu học tập và cảnh báo từ thiết bị.</span>
            </label>

            <label className="block text-[13px] font-bold text-slate-800">
              Thiết bị ONBI
              <select value={deviceId} onChange={(event) => setDeviceId(event.target.value)} disabled={devices.length === 0} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-[#0B008B] focus:ring-1 focus:ring-[#0B008B] disabled:bg-slate-50 disabled:text-slate-400 shadow-sm appearance-none">
                {devices.length === 0 && <option value="">Chưa có thiết bị khả dụng</option>}
                {devices.map((device) => <option key={device.deviceId} value={device.deviceId}>{device.serialNumber}{device.model ? ` · ${device.model}` : ''}</option>)}
              </select>
              <span className="mt-2 block text-[12px] font-normal text-slate-500">Chỉ hiển thị thiết bị đã kích hoạt và chưa gán cho trẻ khác.</span>
            </label>

            <div className="rounded-2xl border border-[#D1F4F9] bg-[#E8FAFC] p-5">
              <p className="text-[13px] font-bold text-slate-900">Xác nhận liên kết</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700"><strong>{selectedDevice?.serialNumber ?? 'Thiết bị chưa chọn'}</strong> sẽ được dùng để theo dõi phiên học của <strong>{selectedChild?.name ?? 'hồ sơ chưa chọn'}</strong>.</p>
            </div>

            <div className="flex justify-center pt-5">
              <button type="submit" disabled={submitting || !childId || !deviceId} className="min-h-[50px] min-w-[200px] rounded-full bg-[#0B008B] hover:bg-[#090070] px-8 font-bold text-sm text-white shadow-[0_8px_20px_rgba(11,0,139,0.2)] transition-all hover:shadow-[0_12px_25px_rgba(11,0,139,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? 'Đang gán thiết bị…' : 'Lưu và hoàn tất'}</button>
            </div>
          </form>
        </section>

        <p className="mx-auto mt-5 max-w-md text-center text-sm leading-6 text-slate-500">Cần hỗ trợ? Liên hệ đội ngũ ONBI và cung cấp số serial in trên thiết bị.</p>
      </div>
      </section>
    </main>
  );
}

