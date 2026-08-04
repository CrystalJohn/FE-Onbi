'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle, ChevronDown, ChevronUp, DoorOpen, EyeOff,
  History, Radio, X,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDurationSec } from '@/lib/format';
import type { Child, MonitoringSession, Snapshot, StudySession } from '@/types';
import BackButton from '@/components/ui/BackButton';

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

/* ---------- cấu trúc sau khi gộp: Ngày -> Phiên giám sát -> Chu kỳ ---------- */
interface MonBlock {
  session: MonitoringSession;
  cycles: StudySession[];
  extraShots: Snapshot[];   // ảnh trong phiên nhưng ngoài mọi chu kỳ (hết giờ học mà chưa tắt)
}
interface DayGroup {
  key: string;
  date: Date;
  blocks: MonBlock[];
  cycleCount: number;
  totalStudySec: number;
  alertCount: number;
  avgScore: number | null;
}

export default function MonitoringHistoryPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = use(params);
  const [child, setChild] = useState<Child | null>(null);
  const [monSessions, setMonSessions] = useState<MonitoringSession[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDays, setOpenDays] = useState<Set<string>>(new Set());
  const [openCycles, setOpenCycles] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<Snapshot | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<Child>(`/children/${childId}`),
      api.get<MonitoringSession[]>(`/children/${childId}/monitoring/history`),
      api.get<StudySession[]>(`/children/${childId}/monitoring/study-sessions?limit=200`),
      api.get<Snapshot[]>(`/children/${childId}/monitoring/snapshots?limit=200`),
    ]).then(([childRes, monRes, sessionRes, snapshotRes]) => {
      setChild(childRes.data);
      setMonSessions(monRes.data);
      setSessions(sessionRes.data);
      setSnapshots(snapshotRes.data);
      const first = monRes.data[0] ?? sessionRes.data[0];
      if (first) setOpenDays(new Set([dayKey(new Date(first.startedAt))]));
    }).catch(() => setError('Không thể tải lịch sử giám sát.')).finally(() => setLoading(false));
  }, [childId]);

  const days = useMemo(() => buildDays(monSessions, sessions, snapshots), [monSessions, sessions, snapshots]);

  if (loading) return <div className="mx-auto max-w-4xl animate-pulse space-y-4"><div className="h-14 w-72 rounded-xl bg-slate-200" />{[1, 2, 3].map((item) => <div key={item} className="h-24 rounded-2xl bg-slate-200" />)}</div>;

  return <div className="mx-auto max-w-4xl space-y-5">
    <header className="flex items-center gap-3"><BackButton fallback={`/parent/monitoring/${childId}`} /><div><p className="text-sm font-medium text-cyan-700">{child?.name ?? 'Bé'}</p><h1 className="text-2xl font-bold text-slate-950">Lịch sử giám sát</h1></div></header>
    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

    {days.length === 0 ? (
      <section className="rounded-3xl border border-slate-200 bg-white p-6"><div className="grid min-h-64 place-items-center text-center text-sm text-slate-500"><div><History className="mx-auto mb-3 h-9 w-9 text-slate-300" /><p className="font-medium text-slate-700">Chưa có phiên giám sát nào</p><p className="mt-1">Phiên đầu tiên của bé sẽ xuất hiện tại đây.</p></div></div></section>
    ) : (
      <div className="space-y-3">
        {days.map((day) => {
          const open = openDays.has(day.key);
          return <section key={day.key} className={`rounded-3xl border bg-white p-4 sm:p-5 ${open ? 'border-cyan-200' : 'border-slate-200'}`}>
            <button onClick={() => setOpenDays((prev) => toggled(prev, day.key))} className="flex w-full flex-wrap items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900">{dayTitle(day.date)} <span className="text-xs font-normal text-slate-400">· {day.date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span></p>
                <p className="mt-0.5 text-sm text-slate-500">{day.blocks.length} phiên · {day.cycleCount} chu kỳ · học {formatDurationSec(day.totalStudySec)}{day.alertCount > 0 && ` · ${day.alertCount} cảnh báo`}</p>
              </div>
              {day.avgScore != null && <span className={`rounded-full px-3 py-1 text-xs font-bold ${scoreBadge(day.avgScore)}`}>TB {day.avgScore}%</span>}
              {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>

            {open && <div className="mt-3 space-y-4 border-t border-slate-100 pt-3">
              {day.blocks.map((block) => <div key={block.session.id}>
                <div className="mb-2 flex items-center gap-2 text-sm">
                  <Radio className={`h-4 w-4 ${block.session.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-700">Phiên học {timeOf(block.session.startedAt)}{block.session.stoppedAt ? ` → ${timeOf(block.session.stoppedAt)}` : ''}</span>
                  <span className="text-xs text-slate-400">{block.session.status === 'active' ? '· đang chạy' : ''}</span>
                  <Link href={`/parent/monitoring/${childId}/history/${block.session.id}`} className="ml-auto text-xs font-semibold text-cyan-700 underline-offset-2 hover:underline">Chi tiết phiên →</Link>
                </div>

                <div className="space-y-2">
                  {block.cycles.length === 0 && <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-400">Phiên này chưa có chu kỳ học nào.</p>}
                  {block.cycles.map((cycle) => {
                    const cycleOpen = openCycles.has(cycle.id);
                    const shots = shotsOfCycle(snapshots, block, cycle);
                    const early = isStoppedEarly(cycle);
                    return <div key={cycle.id} className={`rounded-2xl bg-slate-50 ${cycleOpen ? 'border border-slate-200' : ''}`}>
                      <button onClick={() => setOpenCycles((prev) => toggled(prev, cycle.id))} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                        <span className="min-w-16 text-sm font-semibold text-slate-800">Chu kỳ {cycle.cycleNumber}</span>
                        <span className="flex-1 truncate text-xs text-slate-500">{timeOf(cycle.startedAt)} · học {formatDurationSec(cycle.actualStudySeconds)}{early && <span className="ml-1 text-amber-600">· dừng sớm</span>}</span>
                        {cycle.score != null ? <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${scoreBadge(cycle.score)}`}>{Math.round(cycle.score)}%</span> : <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-700">{statusLabel(cycle.status)}</span>}
                        {cycleOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />}
                      </button>
                      {cycleOpen && <div className="border-t border-slate-200 px-3 pb-3 pt-2.5">
                        <ViolationSummary shots={shots} />
                        {shots.length > 0 ? <>
                          <p className="mb-2 mt-3 text-xs text-slate-400">Ảnh trong chu kỳ này — bấm để phóng to</p>
                          <Thumbs shots={thinPostureShots(shots)} onOpen={setLightbox} />
                        </> : <p className="mt-1 text-xs text-slate-400">Không có cảnh báo nào — bé học rất tập trung.</p>}
                      </div>}
                    </div>;
                  })}

                  {block.extraShots.length > 0 && <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="mb-2 text-xs text-slate-400">Ngoài giờ học — trong giờ nghỉ hoặc đã học xong nhưng phiên chưa tắt · bấm để phóng to</p>
                    <Thumbs shots={thinPostureShots(block.extraShots)} onOpen={setLightbox} />
                  </div>}
                </div>
              </div>)}
            </div>}
          </section>;
        })}
      </div>
    )}

    {lightbox && (
      <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4" onClick={() => setLightbox(null)}>
        <div className="relative max-h-[85vh] max-w-3xl" onClick={(event) => event.stopPropagation()}>
          <img src={imageSrc(lightbox.imageUrl)} alt={lightbox.description ?? 'Ảnh cảnh báo'} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
          <p className="mt-2 text-center text-sm text-white">{typeLabel(lightbox.type)} · {timeOf(lightbox.capturedAt)}</p>
          <button onClick={() => setLightbox(null)} aria-label="Đóng" className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 shadow-lg"><X className="h-5 w-5" /></button>
        </div>
      </div>
    )}
  </div>;
}

/* ---------- thành phần nhỏ ---------- */
function Thumbs({ shots, onOpen }: { shots: Snapshot[]; onOpen: (shot: Snapshot) => void }) {
  return <div className="flex flex-wrap gap-2">
    {shots.map((shot) => <button key={shot.id} onClick={() => onOpen(shot)} className="relative overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
      <img src={imageSrc(shot.imageUrl)} alt={shot.description ?? 'Ảnh cảnh báo'} className="h-16 w-24 object-cover" />
      <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1 text-[10px] text-white">{timeOf(shot.capturedAt)}</span>
    </button>)}
  </div>;
}

function ViolationSummary({ shots }: { shots: Snapshot[] }) {
  const counts: Record<string, number> = {};
  for (const shot of shots) counts[normalizeType(shot.type)] = (counts[normalizeType(shot.type)] ?? 0) + 1;
  const rows = [
    { key: 'left_desk', label: 'Rời bàn', icon: DoorOpen, tone: 'text-red-600' },
    { key: 'bad_posture', label: 'Sai tư thế', icon: AlertTriangle, tone: 'text-amber-600' },
    { key: 'unfocused', label: 'Mất tập trung', icon: EyeOff, tone: 'text-amber-600' },
  ].filter((row) => counts[row.key]);
  if (rows.length === 0) return null;
  return <div className="space-y-1.5">
    {rows.map(({ key, label, icon: Icon, tone }) => <div key={key} className="flex items-center gap-2 text-sm text-slate-700">
      <Icon className={`h-4 w-4 ${tone}`} /><span className="flex-1">{label}</span><span className="text-slate-500">{counts[key]} lần</span>
    </div>)}
  </div>;
}

/* ---------- gộp dữ liệu ---------- */
function buildDays(monSessions: MonitoringSession[], cycles: StudySession[], snapshots: Snapshot[]): DayGroup[] {
  // chu kỳ mồ côi: 'đang học' nhưng phiên giám sát của nó đã dừng -> rác do robot restart
  const stoppedIds = new Set(monSessions.filter((m) => m.status !== 'active').map((m) => String(m.id)));
  const validCycles = cycles.filter((c) => !(c.status === 'studying' && stoppedIds.has(String(c.monitoringSessionId))));

  const map = new Map<string, DayGroup>();
  for (const mon of monSessions) {
    const date = new Date(mon.startedAt);
    const key = dayKey(date);
    let group = map.get(key);
    if (!group) { group = { key, date, blocks: [], cycleCount: 0, totalStudySec: 0, alertCount: 0, avgScore: null }; map.set(key, group); }

    const blockCycles = validCycles
      .filter((c) => String(c.monitoringSessionId) === String(mon.id))
      .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
    const blockShots = snapshots.filter((s) => String(s.monitoringSessionId) === String(mon.id));
    const assigned = new Set<string>();
    for (const cycle of blockCycles) {
      for (const shot of blockShots) {
        const t = new Date(shot.capturedAt).getTime();
        if (t >= new Date(cycle.startedAt).getTime() && t <= cycleEnd(cycle)) assigned.add(String(shot.id));
      }
    }
    const extraShots = blockShots
      .filter((s) => !assigned.has(String(s.id)))
      .sort((a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime());

    // phiên trống hoàn toàn (không chu kỳ, không ảnh) thì bỏ qua cho gọn
    if (blockCycles.length === 0 && extraShots.length === 0) continue;

    group.blocks.push({ session: mon, cycles: blockCycles, extraShots });
    group.cycleCount += blockCycles.length;
    group.totalStudySec += blockCycles.reduce((sum, c) => sum + (c.actualStudySeconds ?? 0), 0);
    group.alertCount += blockShots.length;
  }

  for (const group of map.values()) {
    const scored = group.blocks.flatMap((b) => b.cycles).filter((c) => c.score != null);
    group.avgScore = scored.length ? Math.round(scored.reduce((sum, c) => sum + (c.score as number), 0) / scored.length) : null;
    group.blocks.sort((a, b) => new Date(a.session.startedAt).getTime() - new Date(b.session.startedAt).getTime());
  }
  return [...map.values()].filter((g) => g.blocks.length > 0).sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** Ảnh thuộc chu kỳ: cùng phiên giám sát VÀ nằm trong khung giờ chu kỳ */
function shotsOfCycle(snapshots: Snapshot[], block: MonBlock, cycle: StudySession): Snapshot[] {
  return snapshots
    .filter((s) => String(s.monitoringSessionId) === String(block.session.id))
    .filter((s) => { const t = new Date(s.capturedAt).getTime(); return t >= new Date(cycle.startedAt).getTime() && t <= cycleEnd(cycle); })
    .sort((a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime());
}

/** Ảnh 'sai tư thế' chụp dày đặc: mỗi cửa sổ 2 phút chỉ hiện ảnh CUỐI cùng.
 *  (Số lần đếm trong ViolationSummary vẫn dùng đủ ảnh — chỉ phần hiển thị được tỉa.) */
function thinPostureShots(shots: Snapshot[]): Snapshot[] {
  const WINDOW_MS = 2 * 60 * 1000;
  const result: Snapshot[] = [];
  let pending: Snapshot | null = null;   // ảnh sai-tư-thế cuối cùng của cửa sổ hiện tại
  let windowStart = 0;
  for (const shot of shots) {            // shots đã xếp tăng dần theo giờ
    if (normalizeType(shot.type) !== 'bad_posture') { result.push(shot); continue; }
    const t = new Date(shot.capturedAt).getTime();
    if (pending && t - windowStart <= WINDOW_MS) {
      pending = shot;                    // vẫn trong cửa sổ -> thay bằng ảnh mới hơn
    } else {
      if (pending) result.push(pending); // chốt cửa sổ cũ
      pending = shot;
      windowStart = t;
    }
  }
  if (pending) result.push(pending);
  return result.sort((a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime());
}

/** Ảnh chỉ thuộc chu kỳ khi chụp trong GIỜ HỌC (+30s đệm).
 *  Giờ NGHỈ không tính — bé được phép rời bàn/ngồi thoải mái lúc nghỉ,
 *  và điểm số cũng chỉ chấm trong giờ học nên số ảnh mới khớp với điểm.
 *  Ảnh giờ nghỉ / sau khi học xong -> khối "Ngoài giờ học". */
function cycleEnd(cycle: StudySession): number {
  const start = new Date(cycle.startedAt).getTime();
  const studyMs = (cycle.actualStudySeconds > 0 ? cycle.actualStudySeconds : cycle.studyDuration * 60) * 1000;
  return start + studyMs + 30 * 1000;
}

/* ---------- helpers ---------- */
function dayKey(date: Date) { return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; }
function dayTitle(date: Date) {
  const today = new Date();
  const diff = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) / 86400000);
  if (diff === 0) return 'Hôm nay';
  if (diff === 1) return 'Hôm qua';
  return date.toLocaleDateString('vi-VN', { weekday: 'long' }).replace(/^./, (c) => c.toUpperCase());
}
function timeOf(value: string) { return new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); }
function toggled(prev: Set<string>, key: string) { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; }
function scoreBadge(score: number) { return score >= 80 ? 'bg-emerald-100 text-emerald-700' : score >= 65 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'; }
function statusLabel(value: string) { return value === 'completed' ? 'Hoàn thành' : value === 'break' ? 'Đang nghỉ' : 'Đang học'; }
function normalizeType(type: string) { return type === 'posture_bad' ? 'bad_posture' : type; }
function typeLabel(type: string) { const t = normalizeType(type); return t === 'left_desk' ? 'Rời bàn' : t === 'bad_posture' ? 'Sai tư thế' : t === 'unfocused' ? 'Mất tập trung' : 'Ảnh cảnh báo'; }
function imageSrc(url: string) { return url.startsWith('http') ? url : `${apiOrigin}${url.startsWith('/') ? '' : '/'}${url}`; }

function isStoppedEarly(cycle: StudySession) {
  const plannedStudySeconds = Math.max(0, (cycle.studyDuration ?? 0) * 60);
  const actualStudySeconds = Math.max(0, cycle.actualStudySeconds ?? 0);
  if (plannedStudySeconds === 0 || actualStudySeconds === 0) return false;
  return actualStudySeconds < plannedStudySeconds - 60;
}
