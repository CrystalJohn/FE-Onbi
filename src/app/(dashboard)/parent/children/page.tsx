'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bot, CalendarDays, History, Images, Pencil, Radio, Settings2, Timer, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { Child, MonitoringSession } from '@/types';

interface ChildDevice { deviceId: string; serialNumber: string; model?: string; status: string; }
interface ChildHub extends Child { device: ChildDevice | null; session: MonitoringSession | null; }

export default function ChildrenListPage() {
  const [children, setChildren] = useState<ChildHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const loadChildren = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data: childData } = await api.get<Child[]>('/children');
      const details = await Promise.all(childData.map(async (child) => {
        const [deviceResponse, sessionResponse] = await Promise.all([
          api.get<ChildDevice[]>(`/children/${child.id}/devices`),
          api.get<MonitoringSession | { message: string }>(`/children/${child.id}/monitoring/current`),
        ]);
        return { ...child, device: deviceResponse.data[0] ?? null, session: 'id' in sessionResponse.data ? sessionResponse.data : null };
      }));
      setChildren(details);
    } catch { setError('Không thể tải hồ sơ trẻ. Vui lòng thử lại.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadChildren(); }, [loadChildren]);

  const addChild = async (event: React.FormEvent) => {
    event.preventDefault(); setFormLoading(true); setError('');
    try {
      await api.post('/children', { name, dateOfBirth, gender });
      setName(''); setDateOfBirth(''); setGender('male'); setShowForm(false);
      await loadChildren();
    } catch (reason: any) { setError(reason?.response?.data?.message ?? 'Không thể thêm hồ sơ trẻ.'); }
    finally { setFormLoading(false); }
  };

  const deleteChild = async (child: ChildHub) => {
    if (!window.confirm(`Xóa hồ sơ của ${child.name}? Thao tác này không thể hoàn tác.`)) return;
    try { await api.delete(`/children/${child.id}`); await loadChildren(); }
    catch { setError('Không thể xóa hồ sơ trẻ.'); }
  };

  if (loading) return <div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-14 w-72 rounded-xl bg-slate-200" /><div className="grid gap-5 lg:grid-cols-2"><div className="h-96 rounded-3xl bg-slate-200" /><div className="h-96 rounded-3xl bg-slate-200" /></div></div>;

  return <div className="mx-auto max-w-6xl space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">Gia đình của bạn</p><h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-950">Hồ sơ trẻ</h1><p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">Quản lý hồ sơ, thiết bị và hoạt động giám sát theo từng bé.</p></div><button onClick={() => setShowForm((value) => !value)} className="min-h-11 rounded-full bg-[#0B008B] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] transition-colors duration-200 hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">{showForm ? 'Đóng biểu mẫu' : 'Thêm học sinh'}</button></header>

    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

    {showForm && <form onSubmit={addChild} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3 sm:p-6"><label className="text-sm font-semibold text-slate-700">Tên của bé<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Bé An" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" /></label><label className="text-sm font-semibold text-slate-700">Ngày sinh<input required type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" /></label><label className="text-sm font-semibold text-slate-700">Giới tính<select value={gender} onChange={(event) => setGender(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"><option value="male">Nam</option><option value="female">Nữ</option></select></label><button disabled={formLoading} className="min-h-12 rounded-xl bg-cyan-500 px-5 font-semibold text-[#000033] hover:bg-cyan-400 disabled:opacity-50 sm:col-span-3">{formLoading ? 'Đang thêm…' : 'Lưu hồ sơ học sinh'}</button></form>}

    {children.length === 0 ? <section className="rounded-[32px] border border-white/80 bg-white/70 px-6 py-16 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl"><h2 className="text-lg font-bold text-slate-900">Chưa có hồ sơ trẻ</h2><p className="mt-2 text-sm text-slate-500">Thêm hồ sơ đầu tiên để bắt đầu kết nối thiết bị ONBI.</p></section> : <section aria-label="Danh sách hồ sơ trẻ" className="grid items-start gap-6 xl:grid-cols-2">{children.map((child) => <StudentCard key={child.id} child={child} onDelete={() => void deleteChild(child)} />)}</section>}
  </div>;
}

function StudentCard({ child, onDelete }: { child: ChildHub; onDelete: () => void }) {
  const monitoring = child.session?.status === 'active';
  return <article className="group relative w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-b from-white via-white/95 to-cyan-50/80 shadow-[0_20px_60px_rgba(15,23,42,0.09)]">
    <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-cyan-300/25 blur-3xl" />
    <div className="relative z-10 p-5">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[19px] bg-gradient-to-br from-[#0B008B] to-indigo-500 text-xl font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)]">
          {child.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <h2 className="truncate text-xl font-bold tracking-tight text-slate-950">{child.name}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
            <CalendarDays aria-hidden="true" className="h-4 w-4 text-cyan-700" />
            <span>{formatDate(child.dateOfBirth)} · {age(child.dateOfBirth)} tuổi · {child.gender === 'male' ? 'Nam' : 'Nữ'}</span>
          </p>
        </div>
        <Link href={`/parent/children/${child.id}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition-colors duration-200 hover:border-cyan-200 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2">
          <Pencil aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">Chỉnh sửa</span>
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <section className="rounded-[22px] border border-white/80 bg-white/65 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-50 text-cyan-800"><Bot aria-hidden="true" className="h-[18px] w-[18px]" /></span>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Thiết bị</p>
          </div>
          {child.device ? <><p className="mt-3 font-bold text-slate-950">{child.device.serialNumber}</p><p className="mt-1 text-sm leading-5 text-slate-600">{child.device.model || 'Robot ONBI'} · {deviceStatus(child.device.status)}</p></> : <><p className="mt-3 font-bold text-slate-950">Chưa kết nối robot</p><p className="mt-1 text-sm leading-5 text-slate-600">Kích hoạt và gán một thiết bị cho bé.</p></>}
        </section>
        <section className="rounded-[22px] border border-white/80 bg-white/65 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className={`grid h-9 w-9 place-items-center rounded-full ${monitoring ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}><Radio aria-hidden="true" className="h-[18px] w-[18px]" /></span>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Giám sát</p>
          </div>
          <p className="mt-3 font-bold text-slate-950">{monitoring ? 'Đang hoạt động' : 'Chưa có phiên đang chạy'}</p>
          <p className="mt-1 text-sm leading-5 text-slate-600">{monitoring && child.session ? `Bắt đầu ${formatTime(child.session.startedAt)}` : 'Sẵn sàng khi bạn cần theo dõi.'}</p>
        </section>
      </div>

      <div className="mt-4 space-y-2.5">
        <Link href={child.device ? `/parent/monitoring/${child.id}` : '/parent/devices'} className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#0B008B] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.22)] transition-colors duration-200 hover:bg-[#07006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
          {monitoring ? 'Mở giám sát' : child.device ? 'Bắt đầu giám sát' : 'Kết nối thiết bị'}
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/parent/monitoring/${child.id}/history`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:border-cyan-200 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"><History aria-hidden="true" className="h-4 w-4" />Lịch sử</Link>
          <Link href={`/parent/monitoring/${child.id}/pomodoro`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:border-cyan-200 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"><Timer aria-hidden="true" className="h-4 w-4" />Pomodoro</Link>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-slate-200/70 pt-2.5">
        <Link href="/parent/devices" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-cyan-800 transition-colors duration-200 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><Settings2 aria-hidden="true" className="h-4 w-4" />Quản lý thiết bị</Link>
        <Link href={`/parent/monitoring/${child.id}/snapshots`} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-cyan-800 transition-colors duration-200 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><Images aria-hidden="true" className="h-4 w-4" />Ảnh cảnh báo</Link>
        <button onClick={onDelete} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50/80 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:ml-auto"><Trash2 aria-hidden="true" className="h-4 w-4" />Xóa hồ sơ</button>
      </div>
    </div>
  </article>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat('vi-VN').format(new Date(value)); }
function formatTime(value: string) { return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
function age(value: string) { const birth = new Date(value); const now = new Date(); let result = now.getFullYear() - birth.getFullYear(); if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) result -= 1; return result; }
function deviceStatus(value: string) { return value === 'active' ? 'Đã kích hoạt' : value === 'deactivated' ? 'Đã vô hiệu hóa' : value; }
