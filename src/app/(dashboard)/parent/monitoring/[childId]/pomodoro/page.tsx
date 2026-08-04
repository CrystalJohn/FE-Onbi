'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock3, Save, TimerReset } from 'lucide-react';
import { api } from '@/lib/api';
import { formatSmartTime } from '@/lib/format';
import type { PomodoroConfig, StudySession } from '@/types';

const defaults: PomodoroConfig = { studyDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, cyclesBeforeLongBreak: 4 };

export default function PomodoroPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = use(params);
  const router = useRouter();
  // Quay lại đúng trang trước đó trong lịch sử; nếu vào thẳng bằng link (không có
  // lịch sử) thì rơi về trang giám sát của bé — tránh kiểu "nhảy qua lại 2 trang".
  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(`/parent/monitoring/${childId}`);
  };
  const [config, setConfig] = useState(defaults);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<PomodoroConfig>(`/children/${childId}/monitoring/pomodoro-config`),
      api.get<StudySession[]>(`/children/${childId}/monitoring/study-sessions?limit=50`),
    ]).then(([configRes, sessionsRes]) => {
      setConfig({ ...defaults, ...configRes.data }); setSessions(sessionsRes.data);
    }).catch(() => setError('Không thể tải cấu hình Pomodoro.')).finally(() => setLoading(false));
  }, [childId]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError(''); setNotice('');
    try { await api.patch(`/children/${childId}/monitoring/pomodoro-config`, config); setNotice('Đã lưu cấu hình Pomodoro.'); }
    catch (reason: any) { setError(reason?.response?.data?.message ?? 'Không thể lưu cấu hình.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="mx-auto max-w-5xl animate-pulse space-y-4"><div className="h-14 w-64 rounded-xl bg-slate-200" /><div className="grid gap-5 lg:grid-cols-2"><div className="h-96 rounded-3xl bg-slate-200" /><div className="h-96 rounded-3xl bg-slate-200" /></div></div>;

  return <div className="mx-auto max-w-5xl space-y-5">
    <header className="flex items-center gap-3"><button type="button" onClick={goBack} aria-label="Quay lại" className="grid min-h-11 min-w-11 place-items-center rounded-xl bg-[#000080] text-white shadow-md transition hover:bg-[#000066] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><ArrowLeft className="h-5 w-5" /></button><div><p className="text-sm font-medium text-cyan-700">Nhịp học tập</p><h1 className="text-2xl font-bold text-slate-950">Pomodoro</h1></div></header>
    {notice && <div role="status" className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 className="h-5 w-5" />{notice}</div>}
    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-100 text-cyan-700"><TimerReset className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-900">Cấu hình thời gian</h2><p className="text-sm text-slate-500">Điều chỉnh theo sức tập trung của bé.</p></div></div><form onSubmit={save} className="grid gap-4 sm:grid-cols-2"><NumberField label="Thời gian học" suffix="phút" min={5} max={60} value={config.studyDuration} onChange={(studyDuration) => setConfig({ ...config, studyDuration })} /><NumberField label="Nghỉ ngắn" suffix="phút" min={1} max={30} value={config.shortBreakDuration} onChange={(shortBreakDuration) => setConfig({ ...config, shortBreakDuration })} /><NumberField label="Nghỉ dài" suffix="phút" min={5} max={60} value={config.longBreakDuration} onChange={(longBreakDuration) => setConfig({ ...config, longBreakDuration })} /><NumberField label="Chu kỳ trước nghỉ dài" suffix="vòng" min={2} max={10} value={config.cyclesBeforeLongBreak} onChange={(cyclesBeforeLongBreak) => setConfig({ ...config, cyclesBeforeLongBreak })} /><button disabled={saving} className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#000080] px-5 font-semibold text-white hover:bg-[#000066] disabled:opacity-50 sm:col-span-2"><Save className="h-4 w-4" />{saving ? 'Đang lưu…' : 'Lưu cấu hình'}</button></form></section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><Clock3 className="h-5 w-5 text-cyan-600" /><h2 className="font-bold text-slate-900">Phiên học gần đây</h2></div>{visibleSessions(sessions).length === 0 ? <div className="grid min-h-64 place-items-center rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">Chưa có phiên học nào được robot ghi nhận.</div> : <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1">{visibleSessions(sessions).map((session) => <article key={session.id} className={`rounded-2xl border p-4 ${scoreCardClass(session.score)}`}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-800">Chu kỳ {session.cycleNumber}</p><p className="mt-1 text-xs text-slate-500">{formatDate(session.startedAt)}</p></div><div className="flex items-center gap-2">{session.score != null && <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${scoreBadgeClass(session.score)}`}>{Math.round(session.score)}% {scoreLabel(session.score)}</span>}<span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700">{statusLabel(session.status)}</span></div></div><div className="mt-3 flex gap-5 text-sm text-slate-600"><span>Học: <b>{formatSeconds(session.actualStudySeconds)}</b></span><span>Nghỉ: <b>{formatSeconds(session.actualBreakSeconds)}</b></span></div></article>)}</div>}</section>
    </div>
  </div>;
}

function NumberField({ label, suffix, min, max, value, onChange }: { label: string; suffix: string; min: number; max: number; value: number; onChange: (value: number) => void }) { return <label className="block text-sm font-medium text-slate-700">{label}<span className="relative mt-1.5 block"><input type="number" required min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="min-h-12 w-full rounded-xl border border-slate-300 px-4 pr-14 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200" /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">{suffix}</span></span></label>; }
function formatDate(value: string) { return formatSmartTime(value); }
/** Ẩn phiên mồ côi (robot restart giữa chừng): chỉ phiên 'Đang học' MỚI NHẤT
 *  và chưa quá 2 giờ mới được coi là đang học thật, còn lại là rác — ẩn đi. */
function visibleSessions(sessions: StudySession[]) {
  return sessions.filter((s, index) => {
    if (s.status !== 'studying') return true;
    return index === 0 && Date.now() - new Date(s.startedAt).getTime() < 2 * 3600 * 1000;
  }).slice(0, 12);
}
// Hiển thị thời lượng dễ đọc: "20 giây" / "1 phút 05 giây" / "25 phút"
function formatSeconds(value: number) {
  const total = Math.max(0, Math.round(value ?? 0));
  if (total < 60) return `${total} giây`;
  const m = Math.floor(total / 60); const s = total % 60;
  return s === 0 ? `${m} phút` : `${m} phút ${String(s).padStart(2, '0')} giây`;
}
function statusLabel(value: string) { return value === 'completed' ? 'Hoàn thành' : value === 'break' ? 'Đang nghỉ' : 'Đang học'; }
// Điểm tập trung: xanh >=80, vàng 65-79, đỏ <65 (khớp thang điểm SessionScorer trên robot)
function scoreLabel(score: number) { return score >= 80 ? 'Tốt' : score >= 65 ? 'Khá' : 'Cần cố gắng'; }
function scoreBadgeClass(score: number) { return score >= 80 ? 'bg-emerald-100 text-emerald-700' : score >= 65 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'; }
function scoreCardClass(score?: number | null) { if (score == null) return 'border-slate-100 bg-slate-50'; return score >= 80 ? 'border-emerald-200 bg-emerald-50/60' : score >= 65 ? 'border-amber-200 bg-amber-50/60' : 'border-red-200 bg-red-50/60'; }
