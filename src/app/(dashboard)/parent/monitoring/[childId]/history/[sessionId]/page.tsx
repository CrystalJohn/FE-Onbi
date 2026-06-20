'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Camera, Clock3, ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';
import type { MonitoringSession, Snapshot, StudySession } from '@/types';

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function SessionDetailPage({ params }: { params: Promise<{ childId: string; sessionId: string }> }) {
  const { childId, sessionId } = use(params);
  const [session, setSession] = useState<MonitoringSession | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [studies, setStudies] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([api.get<MonitoringSession[]>(`/children/${childId}/monitoring/history`), api.get<Snapshot[]>(`/children/${childId}/monitoring/sessions/${sessionId}/snapshots`), api.get<StudySession[]>(`/children/${childId}/monitoring/sessions/${sessionId}/study-sessions`)]).then(([historyRes, snapshotRes, studyRes]) => { setSession(historyRes.data.find((item) => String(item.id) === sessionId) ?? null); setSnapshots(snapshotRes.data); setStudies(studyRes.data); }).catch(() => setError('Không thể tải chi tiết phiên giám sát.')).finally(() => setLoading(false)); }, [childId, sessionId]);
  const studySeconds = useMemo(() => studies.reduce((total, item) => total + (item.actualStudySeconds ?? 0), 0), [studies]);
  if (loading) return <div className="mx-auto max-w-5xl animate-pulse space-y-4"><div className="h-14 w-72 rounded-xl bg-slate-200" /><div className="h-32 rounded-3xl bg-slate-200" /><div className="h-72 rounded-3xl bg-slate-200" /></div>;
  return <div className="mx-auto max-w-5xl space-y-5">
    <header className="flex items-center gap-3"><Link href={`/parent/monitoring/${childId}/history`} aria-label="Quay lại lịch sử" className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><ArrowLeft className="h-5 w-5" /></Link><div><p className="text-sm font-medium text-cyan-700">Chi tiết phiên</p><h1 className="text-2xl font-bold text-slate-950">{session ? formatDate(session.startedAt) : `#${sessionId}`}</h1></div></header>
    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <section className="grid gap-3 sm:grid-cols-3"><Metric icon={Clock3} label="Thời lượng phiên" value={session ? duration(session.startedAt, session.stoppedAt) : '--'} /><Metric icon={Clock3} label="Thời gian học" value={formatSeconds(studySeconds)} /><Metric icon={AlertTriangle} label="Cảnh báo" value={`${snapshots.length} sự kiện`} /></section>
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]"><section className="rounded-3xl border border-slate-200 bg-white p-5"><h2 className="mb-4 font-bold text-slate-900">Các chu kỳ học</h2>{studies.length === 0 ? <Empty icon={Clock3} text="Phiên này chưa có dữ liệu Pomodoro." /> : <div className="space-y-3">{studies.map((item) => <article key={item.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between gap-3"><p className="font-semibold text-slate-800">Chu kỳ {item.cycleNumber}</p><span className="text-xs font-medium text-cyan-700">{item.status}</span></div><p className="mt-2 text-sm text-slate-500">Học {formatSeconds(item.actualStudySeconds)} · Nghỉ {formatSeconds(item.actualBreakSeconds)}</p></article>)}</div>}</section><section className="rounded-3xl border border-slate-200 bg-white p-5"><h2 className="mb-4 font-bold text-slate-900">Ảnh cảnh báo</h2>{snapshots.length === 0 ? <Empty icon={ImageIcon} text="Không có ảnh cảnh báo trong phiên này." /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{snapshots.map((snapshot) => <figure key={snapshot.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"><div className="aspect-[4/3] bg-slate-100">{snapshot.imageUrl ? <img src={toImageUrl(snapshot.imageUrl)} alt={snapshot.description ?? 'Ảnh cảnh báo'} className="h-full w-full object-cover" /> : <Camera className="m-auto h-full w-8 text-slate-300" />}</div><figcaption className="p-3"><p className="truncate text-xs font-semibold text-slate-700">{snapshot.description ?? typeLabel(snapshot.type)}</p><p className="mt-1 text-[11px] text-slate-400">{formatDate(snapshot.capturedAt)}</p></figcaption></figure>)}</div>}</section></div>
  </div>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-4"><Icon className="mb-3 h-5 w-5 text-cyan-600" /><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-900">{value}</p></div>; }
function Empty({ icon: Icon, text }: { icon: typeof Clock3; text: string }) { return <div className="grid min-h-52 place-items-center rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500"><div><Icon className="mx-auto mb-2 h-7 w-7 text-slate-300" />{text}</div></div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)); }
function duration(start: string, end?: string) { const seconds = Math.max(0, Math.floor(((end ? new Date(end).getTime() : Date.now()) - new Date(start).getTime()) / 1000)); return formatSeconds(seconds); }
function formatSeconds(value: number) { const minutes = Math.floor((value ?? 0) / 60); return minutes < 60 ? `${minutes} phút` : `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`; }
function toImageUrl(value: string) { return value.startsWith('http') ? value : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`; }
function typeLabel(value: string) { return value === 'left_desk' ? 'Rời bàn' : value === 'bad_posture' ? 'Sai tư thế' : 'Ảnh cảnh báo'; }
