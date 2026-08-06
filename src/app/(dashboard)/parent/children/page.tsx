'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, Camera, Wifi, WifiOff, CalendarDays, Pencil, Plus, Settings2, Trash2, Loader2, Check, Play } from 'lucide-react';
import { api } from '@/lib/api';
import type { Child, MonitoringSession } from '@/types';
import BackButton from '@/components/ui/BackButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChildDevice { deviceId: string; serialNumber: string; model?: string; status: string; assignedChildId?: string | null; }
interface ChildHub extends Child { device: ChildDevice | null; session: MonitoringSession | null; }

export default function ChildrenListPage() {
  const [children, setChildren] = useState<ChildHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState('');
  const [confirmChild, setConfirmChild] = useState<ChildHub | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadChildren = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [childRes, deviceRes] = await Promise.all([
        api.get<Child[]>('/children'),
        api.get<ChildDevice[]>('/devices')
      ]);
      
      const childData = childRes.data;
      const deviceData = deviceRes.data;

      const details = await Promise.all(childData.map(async (child) => {
        const sessionResponse = await api.get<MonitoringSession | { message: string }>(`/children/${child.id}/monitoring/current`);
        const assignedDevice = deviceData.find(d => d.assignedChildId === child.id) ?? null;
        return { ...child, device: assignedDevice, session: 'id' in sessionResponse.data ? sessionResponse.data : null };
      }));
      setChildren(details);
    } catch { setError('Không thể tải hồ sơ trẻ. Vui lòng thử lại.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadChildren(); }, [loadChildren]);

  useEffect(() => {
    if (!confirmChild) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmChild(null); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [confirmChild]);

  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => {
      setStatus('idle');
      setName(''); setDateOfBirth(''); setGender('male'); setPinEnabled(false); setPin(''); setShowForm(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [status]);

  const addChild = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pinEnabled && pin.length !== 6) { setError('Mã PIN phải gồm đúng 6 chữ số.'); return; }
    setStatus("loading"); setError('');
    try {
      await api.post('/children', { name, dateOfBirth, gender, pin: pinEnabled ? pin : undefined });
      await loadChildren();
      setStatus("success");
    } catch (reason: any) { 
      setError(reason?.response?.data?.message ?? 'Không thể thêm hồ sơ bé.'); 
      setStatus("idle");
    }
  };

  const deleteChild = async () => {
    if (!confirmChild) return;
    setDeleting(true);
    try { await api.delete(`/children/${confirmChild.id}`); setConfirmChild(null); await loadChildren(); }
    catch { setError('Không thể xóa hồ sơ bé.'); }
    finally { setDeleting(false); }
  };

  if (loading) return <div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-14 w-72 rounded-xl bg-slate-200" /><div className="grid gap-5 lg:grid-cols-2"><div className="h-96 rounded-3xl bg-slate-200" /><div className="h-96 rounded-3xl bg-slate-200" /></div></div>;

  return <div className="mx-auto max-w-6xl space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-3">
        <BackButton fallback="/parent/dashboard" />
        <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">Gia đình của bạn</p><h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-950">Hồ sơ trẻ</h1><p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">Quản lý hồ sơ và hoạt động phiên học theo từng bé.</p></div>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        <Link href="/parent/devices" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/75 px-5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2">
          <Settings2 aria-hidden="true" className="h-4 w-4" />Quản lý thiết bị
        </Link>
        <button onClick={() => setShowForm((value) => !value)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0B008B] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,0,139,0.20)] transition-colors duration-200 hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
          {!showForm && <Plus aria-hidden="true" className="h-4 w-4" />}{showForm ? 'Đóng biểu mẫu' : 'Thêm hồ sơ bé'}
        </button>
      </div>
    </header>

    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

    {showForm && <form onSubmit={addChild} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3 sm:p-6"><label className="text-sm font-semibold text-slate-700">Tên của bé<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Bé An" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" /></label><label className="text-sm font-semibold text-slate-700">Ngày sinh<input required type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" /></label><label className="text-sm font-semibold text-slate-700">Giới tính<select value={gender} onChange={(event) => setGender(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"><option value="male">Nam</option><option value="female">Nữ</option></select></label><div className="sm:col-span-3"><label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"><input type="checkbox" checked={pinEnabled} onChange={(event) => { setPinEnabled(event.target.checked); if (!event.target.checked) setPin(''); }} className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />Đặt mã PIN cho hồ sơ này</label>{pinEnabled && <input value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="off" maxLength={6} placeholder="Mã PIN 6 số" className="mt-2 min-h-12 w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 text-base tracking-[0.3em] outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" />}<p className="mt-1.5 text-xs text-slate-500">Khi đặt mã PIN, phải nhập đúng mã mới bắt đầu phiên học hoặc chỉnh sửa hồ sơ này.</p></div><button type="submit" disabled={status !== "idle"} aria-busy={status === "loading"} aria-live="polite" className="inline-flex items-center justify-center min-h-12 rounded-xl bg-cyan-500 px-5 font-semibold text-[#000033] hover:bg-cyan-400 disabled:opacity-50 sm:col-span-3">
      {status === "loading" ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu…</>
      ) : status === "success" ? (
        <><Check className="mr-2 h-4 w-4" />Đã lưu</>
      ) : (
        "Lưu hồ sơ bé"
      )}
    </button></form>}

    {children.length === 0
      ? <section className="rounded-[32px] border border-white/80 bg-white/70 px-6 py-16 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl"><h2 className="text-lg font-bold text-slate-900">Chưa có hồ sơ trẻ</h2><p className="mt-2 text-sm text-slate-500">Thêm hồ sơ đầu tiên để bắt đầu kết nối thiết bị ONBI.</p></section>
      : <section aria-label="Danh sách hồ sơ trẻ" className="grid items-start gap-6 xl:grid-cols-2">{children.map((child) => <StudentCard key={child.id} child={child} onDelete={() => setConfirmChild(child)} />)}</section>
    }

    {/* ── Delete Confirm Modal ── */}
    <Dialog open={!!confirmChild} onOpenChange={(open) => !open && setConfirmChild(null)}>
      <DialogContent className="max-w-sm rounded-[28px] p-6 border-white/80 shadow-[0_32px_80px_rgba(15,23,42,0.22)]">
        <DialogHeader className="text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-950">Xóa hồ sơ?</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-slate-600">
            Bạn sắp xóa hồ sơ của <span className="font-semibold text-slate-900">{confirmChild?.name}</span>. Thao tác này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu liên quan.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex gap-3">
          <button onClick={() => setConfirmChild(null)} className="flex-1 min-h-11 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">Hủy</button>
          <button onClick={() => void deleteChild()} disabled={deleting} className="flex-1 min-h-11 rounded-full bg-red-600 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">{deleting ? 'Đang xóa…' : 'Xóa hồ sơ'}</button>
        </div>
      </DialogContent>
    </Dialog>
  </div>;
}

function StudentCard({ child, onDelete }: { child: ChildHub; onDelete: () => void }) {
  const monitoring = child.session?.status === 'active';
  const hasDevice = Boolean(child.device);
  return (
    <Card className="relative overflow-hidden flex flex-col justify-between max-w-[560px] w-full mx-auto sm:mx-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-baseline gap-2 text-xl">
          <span className="truncate">{child.name}</span>
          <span className="shrink-0 text-sm font-normal text-muted-foreground">{age(child.dateOfBirth)} tuổi · {child.gender === 'male' ? 'Nam' : 'Nữ'}</span>
        </CardTitle>
        <CardDescription>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${monitoring ? "border-emerald-200 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800" : "border-slate-200 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"}`}><Activity className="h-3 w-3" aria-hidden="true" />{monitoring ? "Đang học" : "Hôm nay chưa học"}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${hasDevice ? "border-cyan-200 bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-400 dark:border-cyan-800" : "border-amber-200 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-800"}`}>
              {hasDevice ? <Wifi className="h-3 w-3" aria-hidden="true" /> : <WifiOff className="h-3 w-3" aria-hidden="true" />}Robot: {hasDevice ? (child.device?.model || 'Robot ONBI') : "Chưa kết nối"}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[44px]">
          <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
            {hasDevice 
              ? `S/N: ${child.device?.serialNumber} · ${deviceStatus(child.device!.status)}`
              : "Kích hoạt và gán một thiết bị cho bé."}
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <Link href={hasDevice ? `/parent/monitoring/${child.id}` : '/parent/devices'} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0B008B] px-4 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#08006D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B008B] focus-visible:ring-offset-2">
            {!hasDevice ? <Wifi className="h-4 w-4" aria-hidden="true" /> : monitoring ? <Camera className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {monitoring ? 'Vào phiên học' : hasDevice ? 'Bắt đầu phiên học' : 'Kết nối thiết bị'}
          </Link>
          <div className="flex gap-2">
            <Link href={`/parent/children/${child.id}`} className="flex flex-1 min-h-10 items-center justify-center gap-1.5 rounded-lg border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Pencil aria-hidden="true" className="h-3.5 w-3.5" /> Chỉnh sửa
            </Link>
            <button type="button" onClick={onDelete} className="flex flex-1 min-h-10 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-500 px-4 text-sm font-medium transition-colors hover:bg-red-100 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" /> Xóa hồ sơ
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) { return new Intl.DateTimeFormat('vi-VN').format(new Date(value)); }
function formatTime(value: string) { return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
function age(value: string) { const birth = new Date(value); const now = new Date(); let result = now.getFullYear() - birth.getFullYear(); if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) result -= 1; return result; }
function deviceStatus(value: string) { return value === 'active' ? 'Đã kích hoạt' : value === 'deactivated' ? 'Đã vô hiệu hóa' : value; }
