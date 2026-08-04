'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, History, Send } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';



export default function ParentFeedbackPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState<{ deviceId: string; serialNumber?: string | null; model?: string; assignedChildName?: string | null; }[]>([]);

  const loadDevices = useCallback(async () => {
    try {
      const { data } = await api.get<ParentDevice[]>('/devices');
      setDevices(data);
    } catch {
      /* không có thiết bị thì select vẫn cho gửi feedback chung */
    }
  }, []);

  useEffect(() => { void loadDevices(); }, [loadDevices]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSent(false);
    try {
      await api.post('/feedback', {
        subject,
        message,
        ...(deviceSerial.trim() ? { deviceSerial: deviceSerial.trim() } : {}),
      });
      setSent(true);
      setSubject('');
      setMessage('');
      setDeviceSerial('');
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? 'Không thể gửi phản hồi. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Hỗ trợ</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Gửi phản hồi</h1>
          <p className="mt-2 text-sm text-slate-600">Báo lỗi thiết bị hoặc góp ý cho đội ngũ ONBI. Chúng tôi sẽ xem và xử lý.</p>
        </div>
        <Link 
          href="/parent/feedback/history"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2"
        >
          <History className="h-4 w-4" />
          Xem phản hồi đã gửi
        </Link>
      </header>

      <form onSubmit={submit} className="space-y-4 rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
        {sent && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="h-5 w-5" /> Đã gửi phản hồi. Cảm ơn bạn!
          </div>
        )}
        {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <label className="block text-sm font-semibold text-slate-700">
          Tiêu đề
          <input value={subject} onChange={(e) => setSubject(e.target.value)} required maxLength={150} placeholder="VD: Robot không lên hình"
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B008B] focus:ring-2 focus:ring-[#0B008B]/15" />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Nội dung
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={2000} rows={5} placeholder="Mô tả chi tiết vấn đề bạn gặp..."
            className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B008B] focus:ring-2 focus:ring-[#0B008B]/15" />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Thiết bị liên quan <span className="font-normal text-slate-400">(tùy chọn)</span>
          <select
            value={deviceSerial}
            onChange={(e) => setDeviceSerial(e.target.value)}
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-sm text-slate-950 outline-none transition-colors focus:border-[#0B008B] focus:ring-2 focus:ring-[#0B008B]/15"
          >
            <option value="">Không liên quan thiết bị (góp ý chung)</option>
            {devices.filter((d) => d.serialNumber).map((d) => {
              const label = `${d.serialNumber} · ${d.model ?? 'Robot ONBI'}${d.assignedChildName ? ` · ${d.assignedChildName}` : ''}`;
              return <option key={d.deviceId} value={d.serialNumber as string}>{label}</option>;
            })}
          </select>
          {devices.length === 0 && (
            <p className="mt-2 text-xs text-slate-400">Bạn chưa có thiết bị nào để chọn.</p>
          )}
        </label>

        <button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.2)] transition-colors hover:bg-[#08006D] disabled:cursor-not-allowed disabled:opacity-50">
          <Send className="h-4 w-4" /> {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
        </button>
      </form>

    </div>
  );
}
