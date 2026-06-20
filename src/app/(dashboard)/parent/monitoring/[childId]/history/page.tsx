'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Clock3, History, Radio } from 'lucide-react';
import { api } from '@/lib/api';
import type { Child, MonitoringSession } from '@/types';

export default function MonitoringHistoryPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = use(params);
  const [child, setChild] = useState<Child | null>(null);
  const [sessions, setSessions] = useState<MonitoringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { Promise.all([api.get<Child>(`/children/${childId}`), api.get<MonitoringSession[]>(`/children/${childId}/monitoring/history`)]).then(([childRes, historyRes]) => { setChild(childRes.data); setSessions(historyRes.data); }).catch(() => setError('Không thể tải lịch sử giám sát.')).finally(() => setLoading(false)); }, [childId]);
  if (loading) return <div className="mx-auto max-w-4xl animate-pulse space-y-4"><div className="h-14 w-72 rounded-xl bg-slate-200" />{[1,2,3].map((item) => <div key={item} className="h-24 rounded-2xl bg-slate-200" />)}</div>;

  return <div className="mx-auto max-w-4xl space-y-5">
    <header className="flex items-center gap-3"><Link href={`/parent/monitoring/${childId}`} aria-label="Quay lại giám sát" className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><ArrowLeft className="h-5 w-5" /></Link><div><p className="text-sm font-medium text-cyan-700">{child?.name ?? 'Bé'}</p><h1 className="text-2xl font-bold text-slate-950">Lịch sử giám sát</h1></div></header>
    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">{sessions.length === 0 ? <div className="grid min-h-64 place-items-center text-center text-sm text-slate-500"><div><History className="mx-auto mb-3 h-9 w-9 text-slate-300" /><p className="font-medium text-slate-700">Chưa có phiên giám sát</p><p className="mt-1">Phiên đầu tiên sẽ xuất hiện tại đây.</p></div></div> : <div className="space-y-3">{sessions.map((session) => <Link key={session.id} href={`/parent/monitoring/${childId}/history/${session.id}`} className="flex min-h-24 items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-colors hover:border-cyan-200 hover:bg-cyan-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${session.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{session.status === 'active' ? <Radio className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}</span><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900">{formatDate(session.startedAt)}</p><p className="mt-1 text-sm text-slate-500">{duration(session.startedAt, session.stoppedAt)} · {session.status === 'active' ? 'Đang hoạt động' : 'Đã kết thúc'}</p></div><ChevronRight className="h-5 w-5 text-slate-400" /></Link>)}</div>}</section>
  </div>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
function duration(start: string, end?: string) { const minutes = Math.max(0, Math.floor(((end ? new Date(end).getTime() : Date.now()) - new Date(start).getTime()) / 60000)); return minutes < 60 ? `${minutes} phút` : `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`; }
