'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import {
  Activity, AlertTriangle, Camera, Clock3, DoorOpen, History,
  LoaderCircle, Play, Radio, RefreshCw, Square, VideoOff, WifiOff,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatSmartTime } from '@/lib/format';
import BackButton from '@/components/ui/BackButton';

interface Session {
  id: string; childId: string; deviceId: string; startedAt: string;
  stoppedAt?: string | null; status: string;
}
interface Child { id: string; name: string; }
interface AssignedDevice { deviceId: string; serialNumber: string; status: string; }
interface AlertEvent { type: string; description?: string; imageUrl?: string; timestamp?: string; }
interface PomodoroEvent { type: string; cycleNumber: number; message: string; }
interface StreamConfig { iceServers: RTCIceServer[]; }

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function MonitoringPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = use(params);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [device, setDevice] = useState<AssignedDevice | null>(null);
  const [current, setCurrent] = useState<Session | null>(null);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [pomodoro, setPomodoro] = useState<PomodoroEvent | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [deviceOnline, setDeviceOnline] = useState(false);
  const [lastSignalLostAt, setLastSignalLostAt] = useState<string | null>(null);
  const [streamState, setStreamState] = useState<'idle' | 'connecting' | 'live' | 'failed'>('idle');
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const [frameState, setFrameState] = useState<Record<string, any> | null>(null);
  const [selectedAlertImage, setSelectedAlertImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const markDeviceOnline = useCallback(() => {
    setDeviceOnline(true);
    setLastSignalLostAt(null);
  }, []);

  const markDeviceOffline = useCallback((lostAt = new Date().toISOString()) => {
    setDeviceOnline(false);
    setLastSignalLostAt((currentLostAt) => currentLostAt ?? lostAt);
  }, []);

  const closePeer = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreamState('idle');
  }, []);

  const connectStream = useCallback(async (socket: Socket) => {
    closePeer();
    setStreamState('connecting');
    try {
      const { data: config } = await api.get<StreamConfig>(`/children/${childId}/monitoring/stream-config`);
      const peer = new RTCPeerConnection({ iceServers: config.iceServers });
      peerRef.current = peer;
      peer.addTransceiver('video', { direction: 'recvonly' });
      peer.ontrack = ({ streams }) => {
        if (videoRef.current) videoRef.current.srcObject = streams[0];
        setStreamState('live');
        markDeviceOnline(); // có hình WebRTC = robot chắc chắn đang online
      };
      peer.onicecandidate = ({ candidate }) => {
        if (candidate) socket.emit('webrtc-ice-candidate', { childId, candidate, target: 'device' });
      };
      peer.onconnectionstatechange = () => {
        if (peer.connectionState === 'connected') setStreamState('live');
        if (['failed', 'disconnected'].includes(peer.connectionState)) {
          setStreamState('failed');
          if (peer.connectionState === 'disconnected') markDeviceOffline();
        }
      };
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('webrtc-offer', { childId, sdp: offer });
    } catch {
      setStreamState('failed');
      setError('Không thể thiết lập luồng camera. Hãy kiểm tra robot và thử lại.');
    }
  }, [childId, closePeer, markDeviceOffline, markDeviceOnline]);

  const loadData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [childRes, deviceRes, currentRes] = await Promise.all([
        api.get<Child>(`/children/${childId}`),
        api.get<AssignedDevice[]>(`/children/${childId}/devices`),
        api.get<Session | { message: string }>(`/children/${childId}/monitoring/current`),
      ]);
      setChild(childRes.data);
      setDevice(deviceRes.data[0] ?? null);
      const active = 'id' in currentRes.data ? currentRes.data : null;
      setCurrent(active);
    } catch {
      setError('Không thể tải dữ liệu giám sát.');
    } finally { setLoading(false); }
  }, [childId]);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    const socket = io(`${apiOrigin}/monitoring`, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => { setSocketConnected(true); socket.emit('join-room', { childId }); });
    socket.on('disconnect', () => {
      setSocketConnected(false);
      markDeviceOffline();
    });
    socket.on('device-online', markDeviceOnline);
    socket.on('device-status', ({ online }: { online: boolean }) => {
      if (online) markDeviceOnline();
      else markDeviceOffline();
    });
    // nhận được bất kỳ dữ liệu nào từ robot = robot đang online
    socket.on('alert', (event: AlertEvent) => { markDeviceOnline(); setAlerts((items) => [normalizeAlert(event), ...items].slice(0, 20)); });
    socket.on('pomodoro-event', (event: PomodoroEvent) => { markDeviceOnline(); setPomodoro(event); });
    // WebSocket video: annotated JPEG frames pushed by the device (alternative to WebRTC)
    socket.on('video-frame', ({ image, state }: { image: string; state: Record<string, any> | null }) => {
      setFrameUrl(image);
      setFrameState(state);
      markDeviceOnline();
      setStreamState('live');
    });
    socket.on('webrtc-answer', async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      try { await peerRef.current?.setRemoteDescription(sdp); } catch { setStreamState('failed'); }
    });
    socket.on('webrtc-ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      try { await peerRef.current?.addIceCandidate(candidate); } catch { /* candidate may arrive before SDP */ }
    });
    return () => { socket.emit('leave-room', { childId }); socket.disconnect(); closePeer(); };
  }, [childId, closePeer, markDeviceOffline, markDeviceOnline]);

  useEffect(() => {
    if (current && socketConnected && socketRef.current) void connectStream(socketRef.current);
  }, [current, socketConnected, connectStream]);

  const retryStream = () => {
    if (!socketRef.current || !socketConnected) {
      setError('Realtime đang mất kết nối. Hệ thống sẽ tự thử lại khi kết nối socket ổn định.');
      return;
    }
    void connectStream(socketRef.current);
  };

  const start = async () => {
    if (!device) { setError('Chưa có robot nào được gán cho bé.'); return; }
    setBusy(true); setError('');
    try {
      const { data } = await api.post<Session>(`/children/${childId}/monitoring/start`, { deviceId: String(device.deviceId) });
      setCurrent(data);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? 'Không thể bắt đầu giám sát.');
    } finally { setBusy(false); }
  };

  // Phụ huynh chụp ảnh trực tiếp: BE gửi lệnh MQTT xuống robot, ảnh sẽ đổ về
  // khung "Cảnh báo realtime" (loại Chụp thủ công) trong vài giây
  const takeSnapshot = async () => {
    setError('');
    try { await api.post(`/children/${childId}/monitoring/snapshot`); }
    catch (reason: any) { setError(reason?.response?.data?.message ?? 'Không thể gửi yêu cầu chụp.'); }
  };

  const stop = async () => {
    setBusy(true); setError('');
    try { await api.post(`/children/${childId}/monitoring/stop`); setCurrent(null); closePeer(); setFrameUrl(null); setFrameState(null); }
    catch (reason: any) { setError(reason?.response?.data?.message ?? 'Không thể dừng giám sát.'); }
    finally { setBusy(false); }
  };

  if (loading) return <MonitoringSkeleton />;

  const groupedAlerts = groupAlerts(alerts);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-center gap-3">
        <BackButton fallback="/parent/dashboard" />
        <div><p className="text-sm font-medium text-cyan-700">Live Monitoring</p><h1 className="text-2xl font-bold tracking-tight text-slate-950">{child?.name ?? 'Bé'}</h1></div>
        <div className="ml-auto flex gap-2 text-xs font-semibold">
          <StatusBadge active={socketConnected} label={socketConnected ? 'Realtime' : 'Mất kết nối'} />
          <StatusBadge active={deviceOnline} label={deviceOnline ? 'Robot online' : 'Robot offline'} />
        </div>
      </header>

      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertTriangle className="h-5 w-5 shrink-0" /><span className="flex-1">{error}</span><button onClick={loadData} className="font-semibold underline">Thử lại</button></div>}

      <section className="overflow-hidden rounded-3xl border border-cyan-300/10 bg-[#050817] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="relative aspect-video min-h-64 bg-slate-950">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-contain" aria-label={`Camera của ${child?.name ?? 'bé'}`} />
          {frameUrl && <img src={frameUrl} alt={`Camera của ${child?.name ?? 'bé'}`} className="absolute inset-0 h-full w-full object-contain" />}
          {frameUrl && frameState && <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-semibold text-white">{[frameState.seat && `Chỗ ngồi: ${frameState.seat}`, frameState.posture && `Tư thế: ${frameState.posture}`, frameState.focus && `Tập trung: ${frameState.focus}`, frameState.score != null && `Điểm: ${frameState.score}%`].filter(Boolean).join('  ·  ')}</div>}
          {streamState !== 'live' && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-white">
              {!current ? (
                <div><VideoOff className="mx-auto mb-3 h-9 w-9 text-slate-500" /><p className="font-semibold">Camera chưa được bật</p><p className="mt-1 text-sm text-slate-400">Bắt đầu phiên để theo dõi trực tiếp.</p></div>
              ) : streamState === 'connecting' ? (
                <div><LoaderCircle className="mx-auto mb-3 h-9 w-9 animate-spin text-cyan-400" /><p className="font-semibold">Đang kết nối camera…</p><p className="mt-1 text-sm text-slate-400">Thường mất vài giây.</p></div>
              ) : !deviceOnline ? (
                // Robot mất kết nối — hướng dẫn phụ huynh tự kiểm tra
                <div className="max-w-md rounded-2xl border border-red-400/25 bg-red-950/30 p-5">
                  <WifiOff className="mx-auto mb-3 h-9 w-9 text-red-300" />
                  <p className="font-semibold">Robot đang mất kết nối</p>
                  <p className="mt-2 text-sm font-semibold text-red-200">
                    {lastSignalLostAt ? `Mất tín hiệu ${formatSignalLostAt(lastSignalLostAt)}` : 'Mất tín hiệu vừa xong'}
                  </p>
                  <ul className="mx-auto mt-3 max-w-xs list-disc space-y-1 text-left text-sm text-slate-300">
                    <li>Kiểm tra robot còn cắm điện không.</li>
                    <li>Kiểm tra đèn Wi-Fi trên robot có sáng không.</li>
                    <li>Kiểm tra Wi-Fi tại phòng học có hoạt động không.</li>
                  </ul>
                  <p className="mt-3 text-xs text-slate-400">Màn hình sẽ tự kết nối lại khi robot online.</p>
                </div>
              ) : (
                // Robot online nhưng video chưa lên — cho thử lại thật (không reload trang)
                <div className="max-w-sm"><RefreshCw className="mx-auto mb-3 h-9 w-9 text-amber-400" /><p className="font-semibold">Robot online — đang kết nối lại video</p><p className="mt-1 text-sm text-slate-400">Robot vẫn giám sát bình thường, chỉ đường truyền video đang chậm.</p><button onClick={retryStream} disabled={!socketConnected} className="mt-3 rounded-full bg-cyan-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50">Kết nối lại ngay</button></div>
              )}
            </div>
          )}
          {streamState === 'live' && <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white"><Radio className="h-3.5 w-3.5" /> LIVE</span>}
        </div>
        <div className="flex flex-col gap-4 border-t border-cyan-300/10 bg-gradient-to-r from-[#070b22] via-[#0a1640] to-[#070b22] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${current ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-300' : 'border-cyan-300/25 bg-cyan-400/10 text-cyan-300'}`}>
              {current ? <Radio className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-bold tracking-tight text-white">{current ? 'Phiên giám sát đang hoạt động' : 'Sẵn sàng giám sát'}</p>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-400">{device ? `${device.serialNumber} · ${current ? formatDuration(current.startedAt) : 'đã gán'}` : 'Chưa gán robot'}</p>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <div className="flex flex-col gap-2 sm:flex-row">
              <button onClick={takeSnapshot} disabled={!current} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-300/25 bg-white/10 px-5 text-sm font-bold text-cyan-100 transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"><Camera className="h-4 w-4" /> Chụp ảnh ngay</button>
              {current ? <button onClick={stop} disabled={busy} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/90 px-6 text-sm font-bold text-white shadow-[0_12px_32px_rgba(239,68,68,0.22)] transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"><Square className="h-4 w-4" /> Dừng phiên</button> : <button onClick={start} disabled={busy || !device} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 text-sm font-bold text-white shadow-[0_14px_34px_rgba(6,182,212,0.28)] transition-all hover:from-cyan-400 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-45"><Play className="h-4 w-4" /> Bắt đầu giám sát</button>}
            </div>
            {!current && !device && (
              <Link href={`/parent/children/${childId}`} className="text-center text-sm font-semibold text-cyan-300 underline-offset-2 hover:underline">
                Gán thiết bị cho bé ngay →
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-slate-900">Cảnh báo realtime</h2><span className="text-xs text-slate-500">{groupedAlerts.length} nhóm · {alerts.length} sự kiện</span></div>
          {groupedAlerts.length === 0 ? <Empty icon={Activity} text="Chưa có cảnh báo trong phiên này." /> : <div className="max-h-80 space-y-2 overflow-y-auto">{groupedAlerts.map((group, index) => {
            const danger = group.type === 'left_desk';
            const Icon = danger ? DoorOpen : AlertTriangle;
            return <div key={`${group.latest}-${index}`} className={`flex gap-3 rounded-xl p-3 text-sm ${danger ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'}`}>
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{alertLabel(group.type, group.description)}{group.count > 1 && <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${danger ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>×{group.count}</span>}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className={`text-xs ${danger ? 'text-red-700' : 'text-amber-700'}`}>{group.count > 1 ? `Lần cuối ${group.latest ? formatSmartTime(group.latest) : 'vừa xong'}` : group.latest ? formatSmartTime(group.latest) : 'Vừa xong'}</p>
                  {group.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedAlertImage(imageUrl(group.imageUrl!))}
                      className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-colors ${danger ? 'border-red-200 bg-white/70 text-red-700 hover:bg-red-100' : 'border-amber-200 bg-white/70 text-amber-700 hover:bg-amber-100'}`}
                    >
                      Xem ảnh
                    </button>
                  )}
                </div>
              </div>
            </div>;
          })}</div>}
        </section>
        <div className="space-y-4">
          {pomodoro && <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5"><p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Pomodoro · vòng {pomodoro.cycleNumber}</p><p className="mt-2 font-semibold text-slate-900">{pomodoro.message}</p></section>}
          <nav aria-label="Tính năng giám sát" className="grid grid-cols-2 gap-3">
            <QuickLink href={`/parent/monitoring/${childId}/history`} icon={History} label="Lịch sử" />
            <QuickLink href={`/parent/monitoring/${childId}/pomodoro`} icon={Clock3} label="Pomodoro" />
            <QuickLink href={`/parent/monitoring/${childId}/snapshots`} icon={Camera} label="Snapshots" />
            <button onClick={retryStream} disabled={!current || !socketConnected} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 disabled:opacity-40"><RefreshCw className="h-5 w-5" /> Kết nối lại</button>
          </nav>
        </div>
      </div>
      {selectedAlertImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedAlertImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedAlertImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
          >
            Đóng
          </button>
          <img
            src={selectedAlertImage}
            alt="Ảnh cảnh báo"
            className="max-h-full max-w-full rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ active, label }: { active: boolean; label: string }) { return <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}><span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />{label}</span>; }
function QuickLink({ href, icon: Icon, label }: { href: string; icon: typeof History; label: string }) { return <Link href={href} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><Icon className="h-5 w-5" />{label}</Link>; }
function Empty({ icon: Icon, text }: { icon: typeof Activity; text: string }) { return <div className="grid min-h-36 place-items-center rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500"><div><Icon className="mx-auto mb-2 h-6 w-6 text-slate-400" />{text}</div></div>; }
function MonitoringSkeleton() { return <div className="mx-auto max-w-6xl animate-pulse space-y-5"><div className="h-14 w-72 rounded-xl bg-slate-200" /><div className="aspect-video rounded-3xl bg-slate-200" /><div className="grid gap-4 lg:grid-cols-2"><div className="h-56 rounded-2xl bg-slate-200" /><div className="h-56 rounded-2xl bg-slate-200" /></div></div>; }
function formatDuration(start: string) { const minutes = Math.max(0, Math.floor((Date.now() - new Date(start).getTime()) / 60000)); return minutes < 60 ? `${minutes} phút` : `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`; }
function formatSignalLostAt(value: string) {
  const lostAt = new Date(value).getTime();
  if (!Number.isFinite(lostAt)) return 'vừa xong';
  const minutes = Math.max(0, Math.floor((Date.now() - lostAt) / 60000));
  if (minutes < 1) return 'vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} giờ trước`;
  return `từ ${formatSmartTime(value)}`;
}

/** Nhãn tiếng Việt cho từng loại cảnh báo */
function alertLabel(type: string, description?: string) {
  switch (normalizeAlertType(type)) {
    case 'left_desk': return 'Rời bàn học';
    case 'bad_posture':
    case 'posture_bad': return 'Sai tư thế';
    case 'unfocused': return 'Mất tập trung';
    case 'manual': return 'Chụp thủ công';
    default: return description ?? type;
  }
}

interface AlertGroup { type: string; description?: string; count: number; latest?: string; imageUrl?: string; }
/** Gộp các cảnh báo CÙNG LOẠI xảy ra trong vòng 10 phút thành 1 thẻ có số đếm.
 *  alerts đang xếp mới nhất trước — giữ nguyên thứ tự nhóm theo lần xuất hiện mới nhất. */
function groupAlerts(alerts: AlertEvent[]): AlertGroup[] {
  const WINDOW_MS = 10 * 60 * 1000;
  const groups: AlertGroup[] = [];
  for (const rawAlert of alerts) {
    const alert = normalizeAlert(rawAlert);
    const t = new Date(alert.timestamp!).getTime();
    const existing = groups.find((g) => {
      if (g.type !== alert.type) return false;
      const latest = g.latest ? new Date(g.latest).getTime() : t;
      return Math.abs(latest - t) <= WINDOW_MS;
    });
    if (existing) {
      existing.count += 1;
      if (!existing.imageUrl && alert.imageUrl) existing.imageUrl = alert.imageUrl;
    } else {
      groups.push({ type: alert.type, description: alert.description, count: 1, latest: alert.timestamp, imageUrl: alert.imageUrl });
    }
  }
  return groups;
}
function normalizeAlert(alert: AlertEvent): AlertEvent {
  const parsedTime = alert.timestamp ? new Date(alert.timestamp).getTime() : NaN;
  return {
    ...alert,
    type: normalizeAlertType(alert.type),
    timestamp: Number.isFinite(parsedTime) ? alert.timestamp : new Date().toISOString(),
  };
}
function normalizeAlertType(type: string) {
  if (['left_desk', 'away', 'left_table'].includes(type)) return 'left_desk';
  if (['bad_posture', 'posture_bad', 'wrong_posture'].includes(type)) return 'bad_posture';
  if (['unfocused', 'distracted', 'focus_lost'].includes(type)) return 'unfocused';
  return type;
}
function imageUrl(value: string) { return value.startsWith('http') ? value : `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`; }
